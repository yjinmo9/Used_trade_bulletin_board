'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReservationForm from '../components/ReservationForm'

interface Listing {
  id: string
  title: string
  content: string
  price: number
  status: string
  createdAt: string
  authorId: string
}

export default function ListingPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // ✅ 로그인된 사용자 정보 로드
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setCurrentUserId(parsed.id)
    } else {
      alert('로그인이 필요합니다.')
      window.location.href = '/'
    }
  }, [])

  // ✅ 게시글 정보 불러오기
  useEffect(() => {
    if (id) {
      fetch(`/api/listing?id=${id}`)
        .then(res => res.json())
        .then(data => setListing(data))
        .catch(() => setListing(null))
    }
  }, [id])

  const handleReservation = async () => {
    if (!id) return
    setLoading(true)
    setMessage('')
    const res = await fetch('/api/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: id }),
    })
    const data = await res.json()
    setMessage(data.message)
    setLoading(false)
  }

  if (!id) return <div className="p-8">❗ 상품 ID가 없습니다.</div>
  if (!listing) return <div className="p-8">🔍 상품을 불러오는 중...</div>
  if (!currentUserId) return null // 아직 로그인 정보 못 읽은 상태

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-600 mb-2">작성자 ID: {listing.authorId}</p>
      <p className="text-sm text-gray-500 mb-4">작성일: {listing.createdAt.slice(0, 10)}</p>
      <p className="text-lg mb-4">가격: {listing.price.toLocaleString()}원</p>
      <p className="text-md whitespace-pre-line">{listing.content}</p>
      <p className="mt-4 text-sm text-blue-600">상태: {listing.status}</p>

      {currentUserId === listing.authorId ? (
        <>
          <p className="text-red-500 text-sm mt-4">
            본인이 작성한 글은 예약할 수 없습니다
          </p>

          {/* ✅ 판매완료로 변경 버튼 (본인이고 아직 거래완료가 아닐 때만) */}
          {listing.status !== '거래완료' && (
            <button
              onClick={async () => {
                const res = await fetch('/api/posts/mark-complete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ postId: listing.id }),
                })

                if (res.ok) {
                  alert('✅ 판매완료로 상태가 변경되었습니다.')
                  window.location.reload()
                } else {
                  const data = await res.json()
                  alert(`❌ 오류: ${data.message}`)
                }
              }}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              판매완료로 변경
            </button>
          )}
        </>
      ) : (
        <div className="mt-6 space-y-2">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              예약하기
            </button>
          ) : (
            <>
              <h2 className="text-md font-semibold">📅 예약 정보 입력</h2>
              <ReservationForm
                postId={listing.id}
                buyerId={currentUserId}
                onComplete={() => {
                  console.log('✅ 예약 완료 후 폼 닫기')
                  setShowForm(false)
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
