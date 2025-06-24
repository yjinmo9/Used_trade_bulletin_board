// app/page.tsx
"use client";

import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function HomePage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">신뢰 기반 중고거래 게시판</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode("login")}
          className={`px-6 py-2 rounded-xl shadow ${mode === "login" ? "bg-blue-500 text-white" : "bg-white border border-blue-500 text-blue-500"}`}
        >
          로그인
        </button>
        <button
          onClick={() => setMode("register")}
          className={`px-6 py-2 rounded-xl shadow ${mode === "register" ? "bg-green-500 text-white" : "bg-white border border-green-500 text-green-500"}`}
        >
          회원가입
        </button>
      </div>

      <div className="w-full max-w-sm p-6 rounded-xl shadow bg-white">
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </main>
  );
}


