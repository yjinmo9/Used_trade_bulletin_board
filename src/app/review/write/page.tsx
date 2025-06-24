'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Reservation {
  id: string
  post: {
    id: string
    title: string
    author: {
      id: string
      name: string
    }
  }
}

export default function ReviewWritePage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reviewedPostIds, setReviewedPostIds] = useState<Set<string>>(new Set())
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      const parsed = JSON.parse(user)
      setCurrentUserId(parsed.id)
    } else {
      alert('로그인이 필요합니다.')
      window.location.href = '/'
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUserId) return

      const res1 = await fetch(`/api/review/available?userId=${currentUserId}`)
      const data1 = await res1.json()
      setReservations(data1.reservations)
      setReviewedPostIds(new Set(data1.reviewedPostIds))
    }

    fetchData()
  }, [currentUserId])

  if (!currentUserId) return null

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">후기 작성 가능한 거래</h2>
      <ul className="space-y-3">
        {reservations.map(res => {
          const alreadyReviewed = reviewedPostIds.has(res.post.id)

          return (
            <li key={res.id} className="border p-4 rounded shadow">
              <div>
                <strong>{res.post.title}</strong> - 판매자: {res.post.author.name}
              </div>
              {alreadyReviewed ? (
                <span className="text-green-600 mt-2 inline-block font-semibold">✅ 작성 완료</span>
              ) : (
                <Link href={`/review/write/form?reservationId=${res.id}`}>
                  <button className="btn btn-sm btn-primary mt-2">후기 작성하기</button>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
