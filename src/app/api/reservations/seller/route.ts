// src/app/api/reservations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ GET 요청: 판매자가 받은 예약 요청 목록
export async function GET(req: NextRequest) {
  console.log('[API] /api/reservations GET 요청 수신됨');
  const sellerId = req.nextUrl.searchParams.get('sellerId');

  if (!sellerId) {
    return NextResponse.json({ message: '판매자 ID가 필요합니다' }, { status: 400 });
  }

  try {
    // sellerId가 작성한 게시글에 들어온 예약들
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

    console.log(`✅ ${response.length}건 예약 요청 조회 성공`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ 예약 요청 조회 실패:', error);
    return NextResponse.json({ message: '예약 요청 조회 실패' }, { status: 500 });
  }
}
