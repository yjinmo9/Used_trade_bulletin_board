// utils/trustScore.ts

/**
 * EWMA(지수 가중 이동 평균) 계산 함수
 * @param prev 이전 평균값
 * @param current 현재 값
 * @param alpha 0 < alpha <= 1 (최근 값에 더 많은 가중치)
 */
export function ewma(prev: number, current: number, alpha: number = 0.3): number {
  return alpha * current + (1 - alpha) * prev;
}

/**
 * 사용자 신뢰도 점수 계산 함수
 */
export function calculateTrustScore({
  completionRateEWMA,
  reviewAvgEWMA,
  noShowEWMA,
  reportEWMA,
  totalTransactions,
}: {
  completionRateEWMA: number; // 0~1 (ex: 0.9)
  reviewAvgEWMA: number;       // 0~5 (ex: 4.5)
  noShowEWMA: number;
  reportEWMA: number;
  totalTransactions: number;
}): number {
  let score = 0;
  score += completionRateEWMA * 40;
  score += (reviewAvgEWMA / 5) * 30;
  score -= noShowEWMA * 5;
  score -= reportEWMA * 15;
  score += Math.log(1 + totalTransactions) * 3;

  if (score > 100) score = 100;
  if (score < 0) score = 0;
  return Math.round(score);
}

/**
 * 신뢰도 점수에 따라 사용자 상태 분류
 */
export function classifyUserStatus(score: number, reportCount: number): {
  grade: string;
  limits: string[];
} {
  if (score >= 90) return { grade: "프리미엄", limits: [] };
  if (score >= 70) return { grade: "신뢰", limits: [] };
  if (score >= 40) {
    if (reportCount >= 2) return { grade: "보통", limits: ["예약 제한", "계정 경고"] };
    return { grade: "보통", limits: [] };
  }

  // 위험 사용자
  const limits = ["예약 제한", "계정 경고"];
  if (reportCount >= 3) limits.push("예약 정지");
  if (reportCount >= 5) limits.push("계정 정지");
  return { grade: "위험", limits };
}
