// utils/statistics.ts

import { prisma } from '@/lib/prisma';

export async function getMemberStats(memberId: string) {
  const completed = await prisma.post.count({
    where: { authorId: memberId, status: '거래완료' },
  });

  const total = await prisma.post.count({
    where: { authorId: memberId },
  });

  const reviews = await prisma.review.findMany({
    where: { targetId: memberId },
    select: { rating: true },
  });

  const reviewAvg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const noShowCount = await prisma.report.count({
    where: { reportedId: memberId, type: '노쇼' },
  });

  const reportCount = await prisma.report.count({
    where: { reportedId: memberId },
  });

  return {
    completionRateEWMA: completed / (total || 1),
    reviewAvgEWMA: reviewAvg,
    noShowEWMA: noShowCount,
    reportEWMA: reportCount,
    totalTransactions: completed,
    reportCount,
  };
}
