'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Question {
  text: string
  choices: { text: string; scores: Record<string, number> }[]
}

interface ResultType {
  type: string
  name: string
  emoji: string
  description: string
  advice: string
  treatment: string
}

const QUESTIONS: Question[] = [
  {
    text: '朝起きたとき、どんな状態が多いですか？',
    choices: [
      { text: 'スッキリ目覚める', scores: { A: 0, B: 0, C: 0, D: 0 } },
      { text: '頭がボーッとする', scores: { A: 2, B: 1, C: 0, D: 1 } },
      { text: '体がだるくて起き上がれない', scores: { A: 1, B: 2, C: 1, D: 0 } },
      { text: '首や肩が痛い', scores: { A: 0, B: 0, C: 2, D: 1 } },
    ],
  },
  {
    text: 'ストレスを感じたとき、体にどんな反応が出やすいですか？',
    choices: [
      { text: '頭痛やめまいがする', scores: { A: 2, B: 0, C: 1, D: 0 } },
      { text: '胃腸の調子が悪くなる', scores: { A: 0, B: 2, C: 0, D: 1 } },
      { text: '肩や首がガチガチになる', scores: { A: 0, B: 0, C: 2, D: 1 } },
      { text: '眠れなくなる', scores: { A: 1, B: 1, C: 0, D: 2 } },
    ],
  },
  {
    text: '日中、最も気になる不調はどれですか？',
    choices: [
      { text: '集中力が続かない', scores: { A: 2, B: 0, C: 0, D: 1 } },
      { text: '疲れやすい・倦怠感', scores: { A: 0, B: 2, C: 1, D: 0 } },
      { text: '姿勢が悪くなる', scores: { A: 0, B: 0, C: 2, D: 0 } },
      { text: 'イライラ・不安', scores: { A: 1, B: 0, C: 0, D: 2 } },
    ],
  },
  {
    text: '夕方〜夜にかけて、どんな症状が出ますか？',
    choices: [
      { text: '目の疲れ・かすみ', scores: { A: 2, B: 0, C: 1, D: 0 } },
      { text: '足がむくむ・冷える', scores: { A: 0, B: 2, C: 0, D: 1 } },
      { text: '腰が痛くなる', scores: { A: 0, B: 0, C: 2, D: 0 } },
      { text: 'なかなか寝付けない', scores: { A: 0, B: 1, C: 0, D: 2 } },
    ],
  },
  {
    text: '休日の過ごし方は？',
    choices: [
      { text: '家でゴロゴロしがち', scores: { A: 1, B: 2, C: 0, D: 1 } },
      { text: '予定を詰め込む', scores: { A: 1, B: 0, C: 1, D: 1 } },
      { text: '運動やアウトドア', scores: { A: 0, B: 0, C: 1, D: 0 } },
      { text: 'SNSやスマホをずっと見ている', scores: { A: 2, B: 0, C: 1, D: 1 } },
    ],
  },
]

const RESULTS: ResultType[] = [
  {
    type: 'A',
    name: '脳神経疲労タイプ',
    emoji: '🧠',
    description: '脳や神経系に負担がかかりやすいタイプです。デジタルデバイスの使いすぎや情報過多によって、脳が休まらない状態が続いている可能性があります。',
    advice: 'デジタルデトックスの時間を作り、自然の中で過ごす時間を増やしましょう。寝る前の1時間はスマホを見ないようにすると効果的です。',
    treatment: '神経整体（頭蓋骨調整・自律神経バランス調整）がおすすめです。脳への血流を改善し、神経の緊張を和らげます。',
  },
  {
    type: 'B',
    name: '内臓疲労タイプ',
    emoji: '🫀',
    description: '内臓の機能が低下しやすいタイプです。食生活の乱れやストレスにより、消化器系や循環器系に負担がかかっています。',
    advice: '温かい食事を心がけ、腹八分目を意識しましょう。朝一杯の白湯は内臓を温め、機能を活性化させます。',
    treatment: '内臓調整・自律神経バランス調整がおすすめです。内臓の位置を整え、血流とリンパの流れを改善します。',
  },
  {
    type: 'C',
    name: '筋骨格系ストレスタイプ',
    emoji: '💪',
    description: '姿勢の歪みや筋肉の緊張が蓄積しやすいタイプです。デスクワークや運動不足により、体のバランスが崩れています。',
    advice: '1時間に1回は立ち上がってストレッチを行いましょう。特に胸を開く動作と股関節のストレッチが効果的です。',
    treatment: '骨格調整・筋膜リリースがおすすめです。歪みを整え、筋肉の緊張をほぐして正しい姿勢を取り戻します。',
  },
  {
    type: 'D',
    name: '自律神経乱れタイプ',
    emoji: '⚡',
    description: '交感神経と副交感神経のバランスが乱れやすいタイプです。ストレスや生活リズムの乱れにより、自律神経が正常に機能しにくくなっています。',
    advice: '規則正しい生活リズムを心がけましょう。特に「決まった時間に起きる」ことが最も重要です。深呼吸（4秒吸って8秒吐く）を1日3回行うと効果的です。',
    treatment: '自律神経調整・睡眠改善プログラムがおすすめです。神経のバランスを整え、質の高い睡眠を取り戻します。',
  },
]

export default function DiagnosisPage() {
  const [step, setStep] = useState(0) // 0=start, 1-5=questions, 6=result
  const [scores, setScores] = useState<Record<string, number>>({ A: 0, B: 0, C: 0, D: 0 })
  const [resultType, setResultType] = useState<ResultType | null>(null)

  const handleAnswer = (choice: { scores: Record<string, number> }) => {
    const newScores = { ...scores }
    for (const [type, score] of Object.entries(choice.scores)) {
      newScores[type] = (newScores[type] || 0) + score
    }
    setScores(newScores)

    if (step >= QUESTIONS.length) {
      // Find result
      const maxType = Object.entries(newScores).sort(([, a], [, b]) => b - a)[0][0]
      setResultType(RESULTS.find(r => r.type === maxType) || RESULTS[0])
      setStep(QUESTIONS.length + 1)
    } else {
      setStep(step + 1)
    }
  }

  const restart = () => {
    setStep(0)
    setScores({ A: 0, B: 0, C: 0, D: 0 })
    setResultType(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white">←</Link>
          <h1 className="font-bold">神経タイプ診断</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Start */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🧠</div>
            <h2 className="text-2xl font-bold">あなたの神経タイプ診断</h2>
            <p className="text-gray-600 leading-relaxed">
              5つの質問に答えるだけで、あなたの体の不調パターンと最適なケア方法がわかります。
            </p>
            <button onClick={() => setStep(1)}
              className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg">
              診断スタート
            </button>
            <p className="text-xs text-gray-400">所要時間: 約1分</p>
          </div>
        )}

        {/* Questions */}
        {step >= 1 && step <= QUESTIONS.length && (
          <div className="space-y-6">
            <div className="flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div key={i}
                  className={`flex-1 h-1.5 rounded-full ${i < step ? 'bg-purple-600' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500">質問 {step} / {QUESTIONS.length}</p>
            <h2 className="text-lg font-bold">{QUESTIONS[step - 1].text}</h2>
            <div className="space-y-3">
              {QUESTIONS[step - 1].choices.map((choice, i) => (
                <button key={i} onClick={() => handleAnswer(choice)}
                  className="w-full text-left p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-purple-300 transition text-sm">
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {step > QUESTIONS.length && resultType && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-sm text-purple-600 font-medium mb-2">あなたのタイプは...</p>
              <div className="text-5xl mb-3">{resultType.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{resultType.name}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{resultType.description}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="font-bold text-blue-800 mb-2">セルフケアアドバイス</h3>
              <p className="text-sm text-blue-700 leading-relaxed">{resultType.advice}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-5">
              <h3 className="font-bold text-purple-800 mb-2">おすすめの施術</h3>
              <p className="text-sm text-purple-700 leading-relaxed">{resultType.treatment}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white text-center">
              <h3 className="font-bold mb-2">大口神経整体院で改善しませんか？</h3>
              <p className="text-sm opacity-90 mb-3">
                あなたの症状に合わせたオーダーメイド施術をご提供します
              </p>
              <a href="tel:0312345678"
                className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-bold text-sm">
                電話で予約する
              </a>
            </div>

            <button onClick={restart}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
              もう一度診断する
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
