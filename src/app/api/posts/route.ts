// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 게시글 전체 조회
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('❌ 게시글 목록 조회 실패:', error);
    return NextResponse.json({ message: '게시글 불러오기 실패' }, { status: 500 });
  }
}

// 게시글 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, price, authorId } = body;

    if (!title || !content || !authorId) {
      console.warn('⚠️ 필수 항목 누락:', { title, content, authorId });
      return NextResponse.json({ message: '필수 항목 누락' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        price: Number(price),
        authorId,
        status: '판매중',
      },
    });

    console.log('✅ 게시글 생성 성공:', post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('❌ 게시글 생성 오류:', error);
    return NextResponse.json({ message: '게시글 등록 중 오류 발생' }, { status: 500 });
  }
}
