// src/app/api/posts/mark-complete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json({ message: 'postId 누락' }, { status: 400 });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { status: '거래완료' },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('❌ 상태 업데이트 실패:', error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
