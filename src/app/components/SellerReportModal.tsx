'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'

interface SellerReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (type: string, detail: string) => void
  sellerId: string
}

const REPORT_TYPES = ['허위 게시글', '비매너 응답', '사기 의심', '기타']

export default function SellerReportModal({
  isOpen,
  onClose,
  onSubmit,
  sellerId,
}: SellerReportModalProps) {
  const [selectedType, setSelectedType] = useState('')
  const [detail, setDetail] = useState('')

  const handleSubmit = () => {
    if (!selectedType || !detail) {
      alert('신고 유형과 상세 내용을 모두 입력해주세요.')
      return
    }

    onSubmit(selectedType, detail)
    setSelectedType('')
    setDetail('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-96 shadow-lg z-50">
          <Dialog.Title className="text-lg font-bold mb-4">
            판매자 신고하기 (ID: {sellerId})
          </Dialog.Title>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">신고 유형</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">선택하세요</option>
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">상세 내용</label>
            <textarea
              className="w-full border px-3 py-2 rounded h-24"
              placeholder="신고 사유를 구체적으로 작성해주세요."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              제출
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
