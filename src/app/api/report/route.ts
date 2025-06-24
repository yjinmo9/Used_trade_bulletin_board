import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { reporterId, reportedId, type, description } = await req.json()

    if (!reporterId || !reportedId || !type || !description) {
      return NextResponse.json({ message: '필수 항목 누락' }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        type,
        description,
        reporterId,
        reportedId,
      },
    })

    return NextResponse.json({ message: '신고 완료', report })
  } catch (error) {
    console.error('❌ 신고 실패:', error)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}
