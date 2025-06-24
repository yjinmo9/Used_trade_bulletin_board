'use client';

import { useEffect, useState } from 'react';

export default function UserGradeModal({
  userId,
  currentUserId,
  onClose,
}: {
  userId: string;
  currentUserId: string;
  onClose: () => void;
}) {
  const [info, setInfo] = useState<null | {
    grade: string;
    trustScore: number;
    status: string;
  }>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/member?userId=${userId}`);
      const data = await res.json();
      setInfo(data);
    };
    fetchData();
  }, [userId]);

  if (!info) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 bg-white shadow-lg p-6 rounded-xl border text-sm z-50">
      <h2 className="text-lg font-bold mb-3">🧾 사용자 등급 정보</h2>
      <p>등급: <strong>{info.grade}</strong></p>
      {userId === currentUserId && (
        <>
          <p>신뢰도: <strong>{info.trustScore}</strong>점</p>
          <p>계정 상태: {info.status}</p>
        </>
      )}
      <button
        onClick={onClose}
        className="mt-4 bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded"
      >
        닫기
      </button>
    </div>
  );
}
