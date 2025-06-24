// scripts/updateTrustScores.ts
import { prisma } from '@/lib/prisma';
import { calculateTrustScore, classifyUserStatus } from '../utils/trustScore';
import { getMemberStats } from '../utils/statistics';

async function updateAllUserTrustScores() {
  const members = await prisma.member.findMany();

  for (const member of members) {
    const stats = await getMemberStats(member.id);
    const score = calculateTrustScore(stats);
    const { grade, limits } = classifyUserStatus(score, stats.reportCount);

    await prisma.member.update({
      where: { id: member.id },
      data: {
        trustScore: score,
        status: limits.includes('계정 정지') ? '정지' : '정상',
      },
    });

    console.log(
      `✅ ${member.name} ※ Score: ${score}, Grade: ${grade}, Status: ${limits.includes('계정 정지') ? '정지' : '정상'}`
    );
  }

  console.log('\n✨ 모든 회원 신뢰도 갱신 완료!');
}

updateAllUserTrustScores()
  .catch((err) => {
    console.error('❌ 오류 발생:', err);
    process.exit(1);
  })
  .finally(() => process.exit());