'use client'

import { useEffect, useState } from 'react'

interface Reservation {
  id: string
  datetime: string
  location: string
  status: string
  buyerId: string
  post: {
    title: string
    id: string
    authorId: string
    status: string
  }
}

export default function BuyerReviewPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ postId 기준으로 리뷰 존재 여부 관리
  const [reviewMap, setReviewMap] = useState<{ [postId: string]: boolean }>({})
  const [rating, setRating] = useState<{ [postId: string]: number }>({})
  const [content, setContent] = useState<{ [postId: string]: string }>({})

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUserId(user.id)
    } else {
      alert('로그인이 필요합니다.')
      window.location.href = '/'
    }
  }, [])

  useEffect(() => {
    const fetchReservations = async () => {
      if (!currentUserId) return
      try {
        const res = await fetch(`/api/reservations?buyerId=${currentUserId}`)
        const data = await res.json()
        setReservations(data)

        // ✅ postId 기준으로 리뷰 여부 확인
        const reviewStatus: { [postId: string]: boolean } = {}
        await Promise.all(
          data.map(async (resv: Reservation) => {
            if (resv.post.status === '거래완료') {
              const res = await fetch(
                `/api/review/check?postId=${resv.post.id}&writerId=${currentUserId}`
              )
              const result = await res.json()
              reviewStatus[resv.post.id] = result.exists
            }
          })
        )
        console.log('✅ 리뷰 여부 Map:', reviewStatus)
        setReviewMap(reviewStatus)
      } catch (err) {
        console.error('❌ 예약 목록 로드 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [currentUserId])

  const handleSubmit = async (resv: Reservation) => {
    const res = await fetch('/api/review/submit', {
      method: 'POST',
      body: JSON.stringify({
        writerId: currentUserId,
        targetId: resv.post.authorId,
        postId: resv.post.id,
        rating: rating[resv.post.id],
        content: content[resv.post.id],
      }),
    })

    if (res.ok) {
      alert('✅ 리뷰가 등록되었습니다.')
      setReviewMap(prev => ({ ...prev, [resv.post.id]: true }))
    } else {
      const data = await res.json()
      alert(`❌ 오류: ${data.message}`)
    }
  }

  if (!currentUserId) return null

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📝 후기 작성 가능한 거래</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {reservations
            .filter(resv => resv.post.status === '거래완료')
            .map(resv => (
              <li key={resv.id} className="border p-4 rounded shadow">
                <p className="font-semibold">
                  {resv.post.title} - 판매자: {resv.post.authorId}
                </p>
                {reviewMap[resv.post.id] ? (
                  <p className="text-green-600 mt-2">✅ 작성 완료</p>
                ) : (
                  <div className="space-y-2 mt-3">
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      placeholder="별점 (0~5)"
                      value={rating[resv.post.id] || ''}
                      onChange={e =>
                        setRating(prev => ({
                          ...prev,
                          [resv.post.id]: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="후기 내용을 입력하세요"
                      value={content[resv.post.id] || ''}
                      onChange={e =>
                        setContent(prev => ({
                          ...prev,
                          [resv.post.id]: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={() => handleSubmit(resv)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      후기 제출
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
