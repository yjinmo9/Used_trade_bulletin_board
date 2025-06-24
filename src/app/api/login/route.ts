// app/api/login/route.ts (app router용)
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, password } = body

  try {
    const user = await prisma.member.findFirst({
      where: { name, password },
    })

    if (!user) {
      return NextResponse.json({ message: '이름 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    return NextResponse.json({ id: user.id, name: user.name, trustScore: user.trustScore })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}

