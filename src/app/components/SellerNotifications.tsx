// components/SellerNotifications.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ 추가

interface ReservationType {
  id: string;
  postTitle: string;
  buyerName: string;
  datetime: string;
  location: string;
  postId: string;
  buyerId: string;
}

interface SellerNotificationsProps {
  sellerId: string;
  reservations: ReservationType[]
}

export default function SellerNotifications({ sellerId }: SellerNotificationsProps) {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ 추가

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reservations?sellerId=${sellerId}`);
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error('❌ 알림 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: '수락' | '거절') => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id, action }),
      });
      const result = await res.json();
      console.log(`📦 ${action} 결과:`, result);
      await fetchReservations();
      router.refresh(); // ✅ 게시글 상태 강제 새로고침
    } catch (error) {
      console.error(`❌ ${action} 처리 실패`, error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="relative">
      <button
        className="text-sm font-semibold px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
        onClick={() => setVisible(!visible)}
      >
        📬 예약 요청
      </button>

      {visible && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-4 z-50">
          <h2 className="font-bold mb-2">📌 예약 요청</h2>
          {loading ? (
            <p>로딩 중...</p>
          ) : reservations.length === 0 ? (
            <p className="text-sm text-gray-500">예약 요청이 없습니다</p>
          ) : (
            <ul className="space-y-3">
              {reservations.map(res => (
                <li key={res.id} className="border rounded p-3 text-sm">
                  <p><strong>{res.buyerName}</strong>님이 <strong>{res.postTitle}</strong>에 예약 요청</p>
                  <p>일시: {new Date(res.datetime).toLocaleString()}</p>
                  <p>장소: {res.location}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      onClick={() => handleAction(res.id, '수락')}
                    >
                      수락
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      onClick={() => handleAction(res.id, '거절')}
                    >
                      거절
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}