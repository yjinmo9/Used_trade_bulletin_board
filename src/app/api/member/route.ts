// app/api/member/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const user = await prisma.member.findUnique({
    where: { id: userId },
    select: {
      trustScore: true,
      status: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // 등급 계산 (trustScore 기반)
  const score = user.trustScore;
  let grade = '위험';
  if (score >= 90) grade = '프리미엄';
  else if (score >= 70) grade = '신뢰';
  else if (score >= 40) grade = '보통';

  return NextResponse.json({
    trustScore: score,
    grade,
    status: user.status,
  });
}
