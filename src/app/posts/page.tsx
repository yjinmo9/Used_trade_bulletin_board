'use client'

import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  content: string
  price: number
  status: string
  authorId: string
  createdAt: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [form, setForm] = useState({ title: '', content: '', price: '' })
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

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

  const fetchPosts = async () => {
    const res = await fetch('/api/posts')
    const data = await res.json()
    setPosts(data)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) return

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          authorId: currentUserId, // ✅ 로그인된 사용자 ID 사용
        }),
      })
      if (!res.ok) throw new Error('등록 실패')
      setForm({ title: '', content: '', price: '' })
      await fetchPosts()
    } catch (err) {
      console.error('❌ 게시글 등록 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (!currentUserId) return null // 로그인 ID 없으면 아무것도 렌더링 안함

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">중고거래 게시판</h1>

      {/* 📮 글쓰기 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
        <h2 className="text-lg font-semibold">게시글 등록</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="내용"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="가격"
          type="number"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? '등록 중...' : '게시글 등록'}
        </button>
      </form>

      {/* 📋 등록된 글 목록 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">📦 등록된 게시글</h2>
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="border p-4 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-gray-600">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    가격: {post.price.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-400">작성자 ID: {post.authorId}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-600">
                    {post.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
