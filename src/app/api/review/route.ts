import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  console.log('📥 [POST /api/reviews] 요청 수신')

  try {
    const { reservationId, rating, content } = await req.json()
    console.log('🔍 입력값:', { reservationId, rating, content })

    if (!reservationId || !rating || !content) {
      console.warn('⚠️ 입력값 누락')
      return NextResponse.json({ message: '입력값 누락' }, { status: 400 })
    }

    // ✅ 예약 정보 가져오기
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        post: { select: { id: true, authorId: true } },
        buyer: { select: { id: true } },
      },
    })

    if (!reservation) {
      console.warn('❗ 예약 정보 없음:', reservationId)
      return NextResponse.json({ message: '예약 정보 없음' }, { status: 404 })
    }

    console.log('✅ 예약 정보:', {
      postId: reservation.post.id,
      authorId: reservation.post.authorId,
      buyerId: reservation.buyer.id,
    })

    // ✅ 이미 후기 작성했는지 확인
    const existing = await prisma.review.findFirst({
      where: {
        postId: reservation.post.id,
        writerId: reservation.buyer.id,
      },
    })

    if (existing) {
      console.warn('🚫 이미 작성된 후기:', existing)
      return NextResponse.json({ message: '이미 후기 작성됨' }, { status: 409 })
    }

    // ✅ 후기 저장
    const review = await prisma.review.create({
      data: {
        rating,
        content,
        writerId: reservation.buyer.id,
        targetId: reservation.post.authorId,
        postId: reservation.post.id,
      },
    })

    console.log('🎉 후기 저장 성공:', review)

    return NextResponse.json({ message: '후기 작성 완료', review })
  } catch (error) {
    console.error('❌ 후기 작성 중 서버 에러:', error)
    return NextResponse.json({ message: '서버 에러' }, { status: 500 })
  }
}
