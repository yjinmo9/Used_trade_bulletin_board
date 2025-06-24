import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, PostStatus } from '@prisma/client'

const prisma = new PrismaClient();

// ✅ POST: 예약 요청 생성
export async function POST(req: NextRequest) {
  console.log('[API] /api/reservations POST 요청 수신됨');
  try {
    const body = await req.json();
    const { postId, buyerId, datetime, location } = body;

    if (!postId || !buyerId || !datetime || !location) {
      return NextResponse.json({ message: '입력값 누락' }, { status: 400 });
    }

    // 중복 예약 방지
    const existing = await prisma.reservation.findFirst({
      where: { postId, status: '대기중' },
    });
    if (existing) {
      return NextResponse.json({ message: '이미 예약 요청이 존재합니다.' }, { status: 409 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        postId,
        buyerId,
        datetime: new Date(datetime),
        location,
        status: '대기중',
      },
    });

    return NextResponse.json({ message: '예약 요청이 등록되었습니다.', reservation });
  } catch (error) {
    console.error('❌ 예약 요청 실패:', error);
    return NextResponse.json({ message: '예약 요청 실패' }, { status: 500 });
  }
}

// ✅ PATCH: 예약 수락/거절 처리
export async function PATCH(req: NextRequest) {
  console.log('[API] /api/reservations PATCH 요청 수신됨');
  try {
    const { reservationId, action } = await req.json();

    if (!reservationId || !['수락', '거절'].includes(action)) {
      return NextResponse.json({ message: '잘못된 요청' }, { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) {
      return NextResponse.json({ message: '예약 정보 없음' }, { status: 404 });
    }

    const newPostStatus = action === '수락' ? PostStatus.예약중 : PostStatus.판매중;
    const newReservationStatus = action === '수락' ? '수락됨' : '거절됨';

    await prisma.$transaction([
      prisma.reservation.update({
        where: { id: reservationId },
        data: { status: newReservationStatus },
      }),
      prisma.post.update({
        where: { id: reservation.postId },
        data: { status: newPostStatus },
      }),
    ]);

    return NextResponse.json({ message: `예약이 ${action}되었습니다.` });
  } catch (error) {
    console.error('❌ 예약 처리 실패:', error);
    return NextResponse.json({ message: '예약 처리 실패' }, { status: 500 });
  }
}

// ✅ GET: 판매자가 받은 예약 요청 목록
export async function GET(req: NextRequest) {
  console.log('[API] /api/reservations GET 요청 수신됨');
  const sellerId = req.nextUrl.searchParams.get('sellerId');

  if (!sellerId) {
    return NextResponse.json({ message: '판매자 ID가 필요합니다' }, { status: 400 });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        post: { authorId: sellerId },
        status: '대기중',
      },
      include: {
        post: { select: { title: true } },
        buyer: { select: { name: true } },
      },
    });

    const response = reservations.map(r => ({
      id: r.id,
      postId: r.postId,
      postTitle: r.post.title,
      buyerId: r.buyerId,
      buyerName: r.buyer.name,
      datetime: r.datetime,
      location: r.location,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ 예약 요청 조회 실패:', error);
    return NextResponse.json({ message: '예약 요청 조회 실패' }, { status: 500 });
  }
}
