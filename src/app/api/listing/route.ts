// app/api/listing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    console.log('[API /api/listing] ▶ 요청 수신됨');
    console.log('▶ 쿼리 ID:', id);

    if (!id) {
      console.warn('⚠️ ID 누락 - 400 반환');
      return NextResponse.json({ error: 'No ID' }, { status: 400 });
    }

    const listing = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!listing) {
      console.warn(`❌ 해당 ID(${id})에 대한 listing 없음 - 404 반환`);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    console.log('✅ 조회 성공:', listing.title);
    return NextResponse.json(listing);

  } catch (error) {
    console.error('🔥 서버 에러 발생:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
