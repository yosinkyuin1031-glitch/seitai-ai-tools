'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center space-y-4">
        <div className="text-4xl" aria-hidden="true">&#x26A0;&#xFE0F;</div>
        <h2 className="text-lg font-bold text-gray-800">エラーが発生しました</h2>
        <p className="text-sm text-gray-500">
          予期しないエラーが発生しました。もう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
          aria-label="再試行する"
        >
          再試行
        </button>
      </div>
    </div>
  )
}
