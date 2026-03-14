'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QuizChoice {
  text: string
  type: string
}

interface QuizQuestion {
  text: string
  choices: QuizChoice[]
}

interface QuizResult {
  type: string
  name: string
  emoji: string
  description: string
  advice: string
  treatment: string
}

interface GeneratedQuiz {
  title: string
  description: string
  questions: QuizQuestion[]
  results: QuizResult[]
}

const THEME_PRESETS = [
  '睡眠の質チェック',
  '自律神経バランス診断',
  'ストレス耐性タイプ診断',
  '体の歪みチェック',
  '頭痛タイプ診断',
  '冷え性タイプ診断',
  '疲労タイプ診断',
  'メンタルヘルスチェック',
]

export default function QuizGeneratorPage() {
  const [theme, setTheme] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [style, setStyle] = useState('balanced')
  const [generating, setGenerating] = useState(false)
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Preview state
  const [previewStep, setPreviewStep] = useState(0) // 0=not previewing
  const [previewScores, setPreviewScores] = useState<Record<string, number>>({})
  const [previewResult, setPreviewResult] = useState<QuizResult | null>(null)

  const handleGenerate = async () => {
    if (!theme.trim()) return
    setGenerating(true)
    setError('')
    setQuiz(null)
    setPreviewStep(0)

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, questionCount, style }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQuiz(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成エラー')
    }
    setGenerating(false)
  }

  const startPreview = () => {
    setPreviewStep(1)
    setPreviewScores({})
    setPreviewResult(null)
  }

  const handlePreviewAnswer = (choice: QuizChoice) => {
    if (!quiz) return
    const newScores = { ...previewScores }
    newScores[choice.type] = (newScores[choice.type] || 0) + 1
    setPreviewScores(newScores)

    if (previewStep >= quiz.questions.length) {
      const maxType = Object.entries(newScores).sort(([, a], [, b]) => b - a)[0][0]
      setPreviewResult(quiz.results.find(r => r.type === maxType) || quiz.results[0])
      setPreviewStep(quiz.questions.length + 1)
    } else {
      setPreviewStep(previewStep + 1)
    }
  }

  const copyJSON = () => {
    if (!quiz) return
    navigator.clipboard.writeText(JSON.stringify(quiz, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white">←</Link>
          <h1 className="font-bold">診断クイズ生成</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Generator form */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-lg">テーマを選択・入力</h2>
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${theme === t ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
          <input value={theme} onChange={e => setTheme(e.target.value)}
            placeholder="診断テーマを入力..."
            className="w-full px-4 py-3 border rounded-lg text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">質問数</label>
              <select value={questionCount} onChange={e => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value={3}>3問</option>
                <option value={5}>5問</option>
                <option value={7}>7問</option>
                <option value={10}>10問</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">スタイル</label>
              <select value={style} onChange={e => setStyle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="balanced">バランス型</option>
                <option value="fun">エンタメ型</option>
                <option value="medical">専門型</option>
              </select>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={generating || !theme.trim()}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold disabled:opacity-50">
            {generating ? 'AI生成中...' : '診断クイズを生成'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
        )}

        {/* Generated Quiz */}
        {quiz && previewStep === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">{quiz.title}</h2>
              <button onClick={copyJSON}
                className={`px-3 py-1.5 rounded-lg text-xs ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {copied ? 'コピー済み' : 'JSONコピー'}
              </button>
            </div>
            <p className="text-sm text-gray-500">{quiz.description}</p>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">質問 ({quiz.questions.length}問)</h3>
              {quiz.questions.map((q, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2">
                  <p className="text-sm font-medium">Q{i + 1}. {q.text}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {q.choices.map((c, j) => (
                      <span key={j} className="text-xs bg-white px-2 py-0.5 rounded border">
                        {c.text} <span className="text-gray-400">({c.type})</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-700 mb-2">結果タイプ ({quiz.results.length}種)</h3>
              {quiz.results.map((r, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-medium text-sm">{r.emoji} {r.name} (タイプ{r.type})</p>
                  <p className="text-xs text-gray-500 mt-1">{r.description.slice(0, 80)}...</p>
                </div>
              ))}
            </div>

            <button onClick={startPreview}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold">
              プレビューで試す
            </button>
          </div>
        )}

        {/* Preview mode */}
        {quiz && previewStep >= 1 && previewStep <= quiz.questions.length && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">プレビュー</h3>
              <button onClick={() => setPreviewStep(0)} className="text-xs text-gray-500">終了</button>
            </div>
            <div className="flex gap-1">
              {quiz.questions.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < previewStep ? 'bg-orange-500' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500">Q{previewStep} / {quiz.questions.length}</p>
            <h2 className="text-lg font-bold">{quiz.questions[previewStep - 1].text}</h2>
            <div className="space-y-2">
              {quiz.questions[previewStep - 1].choices.map((c, i) => (
                <button key={i} onClick={() => handlePreviewAnswer(c)}
                  className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-orange-50 hover:ring-1 hover:ring-orange-300 transition text-sm">
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {quiz && previewResult && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center space-y-4">
            <p className="text-sm text-orange-600 font-medium">結果</p>
            <div className="text-4xl">{previewResult.emoji}</div>
            <h2 className="text-xl font-bold">{previewResult.name}</h2>
            <p className="text-sm text-gray-600">{previewResult.description}</p>
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <p className="text-xs font-bold text-blue-700 mb-1">アドバイス</p>
              <p className="text-sm text-blue-600">{previewResult.advice}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-left">
              <p className="text-xs font-bold text-purple-700 mb-1">おすすめ施術</p>
              <p className="text-sm text-purple-600">{previewResult.treatment}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={startPreview}
                className="flex-1 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">もう一度</button>
              <button onClick={() => setPreviewStep(0)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">編集に戻る</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
