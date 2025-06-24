import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { writerId, targetId, postId, rating, content } = await req.json()

  if (!writerId || !targetId || !postId || !rating || !content) {
    return NextResponse.json({ message: '입력값 누락' }, { status: 400 })
  }

  // 중복 작성 방지
  const existing = await prisma.review.findFirst({
    where: { writerId, postId },
  })

  if (existing) {
    return NextResponse.json({ message: '이미 작성된 리뷰입니다.' }, { status: 409 })
  }

  try {
    const review = await prisma.review.create({
      data: {
        writerId,
        targetId,
        postId,
        rating,
        content,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('❌ 리뷰 등록 실패:', error)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}
