'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BlogGeneratingSkeleton } from '@/components/Skeleton'
import { showToast } from '@/components/Toast'
import { saveContent } from '@/lib/contentApi'

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
  const [validationError, setValidationError] = useState('')

  const SYMPTOM_PRESETS = [
    '頭痛', 'めまい', '自律神経失調症', '不眠・睡眠障害', '肩こり',
    '腰痛', '首の痛み', '倦怠感', 'パニック障害', '耳鳴り',
  ]

  const validate = (): boolean => {
    if (!keyword.trim()) {
      setValidationError(mode === 'symptom' ? '症状名を入力してください' : 'テーマを入力してください')
      return false
    }
    if (keyword.trim().length < 2) {
      setValidationError('2文字以上で入力してください')
      return false
    }
    setValidationError('')
    return true
  }

  const handleGenerate = async () => {
    if (!validate()) return
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
      showToast('ブログ記事を生成しました')
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成エラー')
    }
    setGenerating(false)
  }

  const [saved, setSaved] = useState(false)

  const copyHTML = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.content)
      showToast('HTMLをコピーしました')
    } catch {
      showToast('コピーに失敗しました', 'error')
    }
  }

  const handleSave = async () => {
    if (!result) return
    try {
      await saveContent({
        tool_type: 'blog',
        title: result.title,
        input_data: { keyword, mode, tone, length },
        output_data: result as unknown as Record<string, unknown>,
      })
      setSaved(true)
      showToast('履歴に保存しました')
    } catch {
      showToast('保存に失敗しました', 'error')
    }
  }

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    if (validationError && value.trim().length >= 2) {
      setValidationError('')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white" aria-label="ホームに戻る">&larr;</Link>
          <h1 className="font-bold">AIブログ生成</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <fieldset>
            <legend className="sr-only">記事タイプ</legend>
            <div className="flex gap-2">
              <button onClick={() => setMode('symptom')}
                aria-pressed={mode === 'symptom'}
                aria-label="症状解説モード"
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'symptom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                症状解説
              </button>
              <button onClick={() => setMode('general')}
                aria-pressed={mode === 'general'}
                aria-label="一般テーマモード"
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                一般テーマ
              </button>
            </div>
          </fieldset>

          {mode === 'symptom' && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="症状プリセット">
              {SYMPTOM_PRESETS.map(s => (
                <button key={s} onClick={() => { handleKeywordChange(s) }}
                  aria-pressed={keyword === s}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${keyword === s ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div>
            <input
              value={keyword}
              onChange={e => handleKeywordChange(e.target.value)}
              placeholder={mode === 'symptom' ? '症状名を入力...' : 'テーマを入力...'}
              aria-label={mode === 'symptom' ? '症状名' : 'テーマ'}
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'keyword-error' : undefined}
              className={`w-full px-4 py-3 border rounded-lg text-sm ${validationError ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'} focus:outline-none focus:ring-2`}
            />
            {validationError && (
              <p id="keyword-error" className="text-red-500 text-xs mt-1.5" role="alert">
                {validationError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tone-select" className="text-xs text-gray-500 mb-1 block">文体</label>
              <select id="tone-select" value={tone} onChange={e => setTone(e.target.value)}
                aria-label="文体を選択"
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="normal">標準</option>
                <option value="professional">専門的</option>
                <option value="casual">カジュアル</option>
              </select>
            </div>
            <div>
              <label htmlFor="length-select" className="text-xs text-gray-500 mb-1 block">文量</label>
              <select id="length-select" value={length} onChange={e => setLength(e.target.value)}
                aria-label="文量を選択"
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="short">短め (1500字)</option>
                <option value="medium">標準 (2500字)</option>
                <option value="long">長め (4000字)</option>
              </select>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={generating}
            aria-label={generating ? 'ブログ記事を生成中' : 'ブログ記事を生成'}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-blue-700 transition">
            {generating ? '生成中...' : 'ブログ記事を生成'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm" role="alert">{error}</div>
        )}

        {generating && <BlogGeneratingSkeleton />}

        {result && !generating && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">{result.title}</h2>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saved}
                    className={`px-3 py-1.5 rounded-lg text-xs transition ${saved ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}>
                    {saved ? '✓ 保存済み' : '💾 保存'}
                  </button>
                  <button onClick={copyHTML}
                    className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                    HTMLコピー
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">{result.metaDescription}</p>
              <div className="flex flex-wrap gap-1 mb-4" aria-label="関連キーワード">
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
