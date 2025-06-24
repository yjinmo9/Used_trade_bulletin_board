// components/RegisterForm.tsx
"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입 시도:", { name, password });
    // TODO: 회원가입 API 호출
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-4 py-2 rounded-xl"
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-4 py-2 rounded-xl"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
      >
        회원가입
      </button>
    </form>
  );
}
