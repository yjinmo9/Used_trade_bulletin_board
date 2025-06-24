'use client'
import { useState, useEffect } from 'react'

export default function ReportModal({
  sellerId,
  onClose,
}: {
  sellerId: string
  onClose: () => void
}) {
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [reporterId, setReporterId] = useState<string | null>(null)

  // ✅ 로그인된 유저 ID 가져오기
  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      const user = JSON.parse(stored)
      setReporterId(user.id)
    } else {
      alert('로그인이 필요합니다.')
      onClose()
    }
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reporterId) return

    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reporterId,
        reportedId: sellerId,
        type,
        description,
      }),
    })

    if (res.ok) {
      alert('신고가 접수되었습니다.')
      onClose()
    } else {
      alert('신고에 실패했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">판매자 신고하기</h2>

        <label className="block mb-1 font-semibold">신고 유형</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full mb-3 border p-2 rounded"
          required
        >
          <option value="">선택</option>
          <option value="노쇼">노쇼</option>
          <option value="허위게시물">허위게시물</option>
          <option value="거래대금미지급">거래대금미지급</option>
          <option value="환불대금미지급">환불대금미지급</option>
        </select>

        <label className="block mb-1 font-semibold">상세 내용</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full h-24 border p-2 rounded mb-4"
          required
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={!reporterId}
          >
            제출
          </button>
        </div>
      </form>
    </div>
  )
}
