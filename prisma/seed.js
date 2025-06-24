// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.review.deleteMany()
  await prisma.report.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.post.deleteMany()
  await prisma.member.deleteMany()
  // 1. 회원
  await prisma.member.createMany({
    data: [
      { id: 'M001', name: '홍길동', password: '****', trustScore: 20, status: '예약 제한' },
      { id: 'M002', name: '김영희', password: '****', trustScore: 35, status: '계정 정지' },
      { id: 'M003', name: '김민지', password: '****', trustScore: 95, status: '정상' },
      { id: 'M004', name: '서유진', password: '****', trustScore: 18, status: '계정 경고' },
      { id: 'M005', name: '이지원', password: '****', trustScore: 20, status: '예약 정지' },
    ],
  });

  // 2. 게시글
  await prisma.post.createMany({
    data: [
      {
        id: 'P101',
        title: '아이폰13 팝니다',
        content: '~',
        price: 600000,
        status: '예약중',
        authorId: 'M001',
      },
      {
        id: 'P102',
        title: '책장 나눔',
        content: '~',
        price: 0,
        status: '거래완료',
        authorId: 'M002',
      },
      {
        id: 'P103',
        title: '노트북 판매',
        content: '~',
        price: 850000,
        status: '대기중',
        authorId: 'M003',
      },
      {
        id: 'P104',
        title: '갤럭시 버즈 팝니다',
        content: '한 달 사용',
        price: 120000,
        status: '거래완료',
        authorId: 'M003', // ✅ M003이 판매자
      },
    ],
  });

  // 3. 예약
  await prisma.reservation.createMany({
    data: [
      {
        id: 'R001',
        buyerId: 'M003',
        postId: 'P101',
        datetime: new Date('2024-05-03T15:00:00'),
        location: '기숙사 앞',
        status: '예약중',
      },
      {
        id: 'R002',
        buyerId: 'M001',
        postId: 'P102',
        datetime: new Date('2024-04-20T10:00:00'),
        location: '정문 택배실',
        status: '거래완료',
      },
      {
        id: 'R003',
        buyerId: 'M002',
        postId: 'P103',
        datetime: new Date('2024-05-12T13:30:00'),
        location: '과학도서관 앞',
        status: '대기중',
      },
      {
        id: 'R004',
        buyerId: 'M001',
        postId: 'P104',
        datetime: new Date('2025-06-01T05:00:00'),
        location: '공대 로비',
        status: '거래완료',
      },
    ],
  });

  // 4. 후기
  await prisma.review.createMany({
    data: [
      {
        id: 'RV001',
        writerId: 'M003',
        targetId: 'M001',
        postId: 'P101',
        rating: 5.0,
        content: '시간 잘 맞추셨어요',
        createdAt: new Date('2024-05-04'),
      },
      {
        id: 'RV002',
        writerId: 'M001',
        targetId: 'M002',
        postId: 'P102',
        rating: 4.5,
        content: '잘 받았습니다',
        createdAt: new Date('2024-04-21'),
      },
    ],
  });

  // 5. 신고
  await prisma.report.createMany({
    data: [
      {
        id: 'RP001',
        reporterId: 'M002',
        reportedId: 'M003',
        type: '노쇼',
        description: '약속 안 지킴',
        createdAt: new Date('2024-05-14'),
      },
      {
        id: 'RP002',
        reporterId: 'M001',
        reportedId: 'M002',
        type: '허위게시물',
        description: '제품이 설명과 달라요',
        createdAt: new Date('2024-04-22'),
      },
      {
        id: 'RP003',
        reporterId: 'M003',
        reportedId: 'M001',
        type: '거래대금미지급',
        description: '송금하겠다고 했는데 안 하셨어요',
        createdAt: new Date('2024-05-05'),
      },
      {
        id: 'RP004',
        reporterId: 'M001',
        reportedId: 'M003',
        type: '환불대금미지급',
        description: '환불 약속하고 안 해줌',
        createdAt: new Date('2024-05-08'),
      },
    ],
  });
}

main()
  .then(() => {
    console.log('🌱 Seed complete!')
    return prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

