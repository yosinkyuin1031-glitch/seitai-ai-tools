'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const TOOLS = [
  {
    href: '/blog',
    title: 'AIブログ生成',
    desc: 'キーワード・症状を入力するだけでSEO最適化されたブログ記事を自動生成。',
    icon: '\u{1F4DD}',
    color: 'bg-blue-500',
  },
  {
    href: '/diagnosis',
    title: '神経タイプ診断',
    desc: '患者様向けのセルフチェック診断。SNS共有で集客にも活用できます。',
    icon: '\u{1F9E0}',
    color: 'bg-purple-500',
  },
  {
    href: '/quiz-generator',
    title: '診断クイズ生成',
    desc: 'オリジナルの診断クイズを簡単作成。テーマを選ぶだけでAIが自動生成。',
    icon: '\u{1F3AF}',
    color: 'bg-orange-500',
  },
]

export default function Home() {
  const [clinicName, setClinicName] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.clinic_name) {
        setClinicName(user.user_metadata.clinic_name)
      }
    })
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold mb-1">整体院AIツール</h1>
          <p className="text-sm opacity-80">ブログ生成・診断・集客ツールをAIでサポート</p>
          {clinicName && (
            <p className="text-xs opacity-60 mt-2">{clinicName}</p>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <nav aria-label="AIツール一覧">
          <div className="space-y-4">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href}
                aria-label={`${tool.title} - ${tool.desc}`}
                className="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition group">
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}
                    aria-hidden="true">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
                      {tool.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{tool.desc}</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-indigo-400 text-xl mt-1" aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-6">
          <Link href="/history"
            className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition group border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">📂</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition text-sm">生成履歴</h3>
                <p className="text-xs text-gray-400">過去に生成したブログ・クイズを確認</p>
              </div>
              <span className="text-gray-300 group-hover:text-indigo-400" aria-hidden="true">&rarr;</span>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition">
            ログアウト
          </button>
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200 py-4 text-center">
        <p className="text-xs text-gray-400">&copy; ClinicApps</p>
      </footer>
    </div>
  )
}
