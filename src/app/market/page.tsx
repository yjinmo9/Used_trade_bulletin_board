// app/market/page.tsx
'use client'

import { useEffect, useState } from 'react'
import MarketTable from '../components/MarketTable'

export default function MarketPage() {
  const [posts, setPosts] = useState([])
  const [reservations, setReservations] = useState([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')

    if (!user?.id) {
      alert('로그인이 필요합니다.')
      window.location.href = '/'
      return
    }

    setCurrentUserId(user.id)

    const fetchData = async () => {
      const res1 = await fetch('/api/posts')
      const postData = await res1.json()
      setPosts(postData)

      const res2 = await fetch(`/api/reservations?sellerId=${user.id}`)
      const reservationData = await res2.json()
      setReservations(reservationData)
    }

    fetchData()
  }, [])

  if (!currentUserId) return null

  return (
    <MarketTable posts={posts} reservations={reservations} currentUserId={currentUserId} />
  )
}
