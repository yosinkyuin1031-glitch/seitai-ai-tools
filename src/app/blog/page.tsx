'use client'

import { useState } from 'react'
import Link from 'next/link'

interface BlogResult {
  title: string
  metaDescription: string
  content: string
  keywords: string[]
}

export default function BlogPage() {
  const [keyword, setKeyword] = useState('')
  const [mode, setMode] = useState<'symptom' | 'general'>('symptom')
  const [tone, setTone] = useState('normal')
  const [length, setLength] = useState('medium')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<BlogResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const SYMPTOM_PRESETS = [
    '頭痛', 'めまい', '自律神経失調症', '不眠・睡眠障害', '肩こり',
    '腰痛', '首の痛み', '倦怠感', 'パニック障害', '耳鳴り',
  ]

  const handleGenerate = async () => {
    if (!keyword.trim()) return
    setGenerating(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, mode, tone, length }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成エラー')
    }
    setGenerating(false)
  }

  const copyHTML = () => {
    if (!result) return
    navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white">←</Link>
          <h1 className="font-bold">AIブログ生成</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setMode('symptom')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'symptom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              症状解説
            </button>
            <button onClick={() => setMode('general')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              一般テーマ
            </button>
          </div>

          {mode === 'symptom' && (
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_PRESETS.map(s => (
                <button key={s} onClick={() => setKeyword(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${keyword === s ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <input
            value={keyword} onChange={e => setKeyword(e.target.value)}
            placeholder={mode === 'symptom' ? '症状名を入力...' : 'テーマを入力...'}
            className="w-full px-4 py-3 border rounded-lg text-sm"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">文体</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="normal">標準</option>
                <option value="professional">専門的</option>
                <option value="casual">カジュアル</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">文量</label>
              <select value={length} onChange={e => setLength(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="short">短め (1500字)</option>
                <option value="medium">標準 (2500字)</option>
                <option value="long">長め (4000字)</option>
              </select>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={generating || !keyword.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50">
            {generating ? '生成中...' : 'ブログ記事を生成'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">{result.title}</h2>
                <button onClick={copyHTML}
                  className={`px-3 py-1.5 rounded-lg text-xs ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {copied ? 'コピー済み' : 'HTMLコピー'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">{result.metaDescription}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {result.keywords.map(k => (
                  <span key={k} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{k}</span>
                ))}
              </div>
              <div className="prose prose-sm max-w-none border-t pt-4"
                dangerouslySetInnerHTML={{ __html: result.content }} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
