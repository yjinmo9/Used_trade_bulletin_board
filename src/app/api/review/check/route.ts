// app/api/review/check/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  const writerId = searchParams.get('writerId')

  if (!postId || !writerId) {
    return NextResponse.json({ message: '누락된 값 있음' }, { status: 400 })
  }

  const review = await prisma.review.findFirst({
    where: { postId, writerId },
  })

  return NextResponse.json({ exists: !!review })
}
