// /app/api/review/available/route.ts
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ message: 'userId 누락' }, { status: 400 })
  }

  // ✅ 1. 거래완료된 모든 예약 (내가 구매자)
  const reservations = await prisma.reservation.findMany({
    where: {
      buyerId: userId,
      post: {
        status: '거래완료',
      },
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          author: {
            select: { id: true, name: true },
          },
        },
      },
    },
  })

  // ✅ 2. 내가 작성한 리뷰의 postId 리스트
  const myReviews = await prisma.review.findMany({
    where: { writerId: userId },
    select: { postId: true },
  })

  const reviewedPostIds = myReviews.map(r => r.postId)

  return NextResponse.json({
    reservations,
    reviewedPostIds,
  })
}
