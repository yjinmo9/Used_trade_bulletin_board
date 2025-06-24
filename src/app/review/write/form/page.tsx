'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ReviewFormPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reservationId = searchParams.get('reservationId')

  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')

  if (!reservationId) {
    return <p className="p-4 text-red-600">❗ reservationId 없음</p>
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (content.trim().length < 10) {
      alert('내용은 최소 10자 이상 입력해주세요.')
      return
    }

    const res = await fetch('/api/review', {
      method: 'POST',
      body: JSON.stringify({
        reservationId,
        rating,
        content,
      }),
    })

    if (res.ok) {
      alert('후기 작성 완료!')
      router.push('/review/write') // 다시 리스트로 이동
    } else {
      alert('작성 실패')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">후기 작성</h2>

      <label className="block mb-1 font-semibold">⭐ 평점</label>
      <select
        value={rating}
        onChange={e => setRating(+e.target.value)}
        className="select select-bordered mb-4"
      >
        {[5, 4, 3, 2, 1].map(n => (
          <option key={n} value={n}>
            {`⭐`.repeat(n)} ({n})
          </option>
        ))}
      </select>

      <label className="block mb-1 font-semibold">📝 내용</label>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="textarea textarea-bordered w-full mb-4"
        rows={4}
        placeholder="후기를 입력하세요"
      />

      <button className="btn btn-primary w-full">후기 제출</button>
    </form>
  )
}
