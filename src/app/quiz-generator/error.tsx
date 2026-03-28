'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function QuizError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Quiz error:', error)
  }, [error])

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white" aria-label="ホームに戻る">&#x2190;</Link>
          <h1 className="font-bold">診断クイズ生成</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center space-y-4">
          <div className="text-4xl" aria-hidden="true">&#x26A0;&#xFE0F;</div>
          <h2 className="text-lg font-bold text-gray-800">エラーが発生しました</h2>
          <p className="text-sm text-gray-500">クイズ生成中に問題が発生しました。</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition"
              aria-label="再試行する"
            >
              再試行
            </button>
            <Link href="/"
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition">
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
