'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🤖</div>
            <h1 className="text-2xl font-bold text-gray-900">整体院AIツール</h1>
            <p className="text-sm text-gray-500 mt-1">by ClinicApps</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="text-2xl mb-1">📝</div>
                <p className="font-medium text-blue-800">AIブログ生成</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3">
                <div className="text-2xl mb-1">🧠</div>
                <p className="font-medium text-purple-800">神経タイプ診断</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3">
                <div className="text-2xl mb-1">🎯</div>
                <p className="font-medium text-orange-800">クイズ生成</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="clinic@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-indigo-700 transition"
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <div className="text-center space-y-2">
              <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-indigo-600">
                パスワードを忘れた方
              </Link>
              <p className="text-xs text-gray-400">
                アカウントをお持ちでない方は <Link href="/signup" className="text-indigo-600 font-medium hover:underline">新規登録</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">&copy; ClinicApps</p>
        </div>
      </div>
    </div>
  )
}
