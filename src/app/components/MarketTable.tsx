'use client'

import Link from 'next/link'
import { useState } from 'react'
import SellerNotifications from './SellerNotifications'
import ReportModal from './ReportModal'
import UserGradeModal from './UserGradeModal'

// 게시글 타입
type PostType = {
  id: string
  title: string
  price: number
  status: string
  authorId: string
  createdAt: string
}

// 예약 타입
type ReservationType = {
  id: string
  postTitle: string
  buyerName: string
  datetime: string
  location: string
  postId: string
  buyerId: string
}

// 컴포넌트 Props
type MarketTableProps = {
  posts: PostType[]
  reservations: ReservationType[]
  currentUserId: string
}

export default function MarketTable({
  posts,
  reservations,
  currentUserId,
}: MarketTableProps) {
  const [reportTarget, setReportTarget] = useState<{ sellerId: string } | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  return (
    <div className="p-8">
      {/* 상단 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">중고거래 게시판</h1>
        <div className="flex items-center gap-4">
          <SellerNotifications sellerId={currentUserId} reservations={reservations} />
          <Link href="/posts" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            게시글 작성하기
          </Link>
          <Link href="/review/write" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            후기 작성하기
          </Link>
        </div>
      </div>

      {/* 모달 */}
      {reportTarget && (
        <ReportModal
          sellerId={reportTarget.sellerId}
          onClose={() => setReportTarget(null)}
        />
      )}

      {selectedUserId && (
        <UserGradeModal
          userId={selectedUserId}
          currentUserId={currentUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {/* 테이블 */}
      <table className="w-full border-t text-center">
        <thead>
          <tr className="border-b font-semibold">
            <th>NO</th>
            <th>제목</th>
            <th>가격</th>
            <th>상태</th>
            <th>아이디</th>
            <th>작성일</th>
            <th>신고</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td>{index + 1}</td>
              <td>
                <Link href={`/listing?id=${item.id}`} className="text-blue-600 hover:underline">
                  {item.title}
                </Link>
              </td>
              <td>{item.price.toLocaleString()}원</td>
              <td>{item.status}</td>
              <td>
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => setSelectedUserId(item.authorId)}
                >
                  {item.authorId}
                </span>
              </td>
              <td>{new Date(item.createdAt).toISOString().slice(0, 10)}</td>
              <td>
                <button
                  className="text-red-500 underline hover:text-red-700"
                  onClick={() => setReportTarget({ sellerId: item.authorId })}
                >
                  신고
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
