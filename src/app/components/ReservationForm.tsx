// components/ReservationForm.tsx
'use client';

import { useState } from 'react';

interface ReservationFormProps {
  postId: string;
  buyerId: string; // 로그인 유저 ID (지금은 임시)
  onComplete?: () => void;
}

export default function ReservationForm({ postId, buyerId, onComplete }: ReservationFormProps) {
  const [datetime, setDatetime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    console.log('[📨 예약 요청 전송]', { postId, buyerId, datetime, location });

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, buyerId, datetime, location }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      console.log('✅ 예약 성공:', data);
      setMessage(data.message);
      if (onComplete) onComplete();
    } catch (err: any) {
      console.error('❌ 예약 실패:', err);
      setMessage(err.message || '예약 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <label className="block">
        예약 일시:
        <input
          type="datetime-local"
          className="border p-2 rounded w-full"
          value={datetime}
          onChange={e => setDatetime(e.target.value)}
          required
        />
      </label>
      <label className="block">
        장소:
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? '예약 요청 중...' : '전송하기'}
      </button>
      {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
    </form>
  );
}
