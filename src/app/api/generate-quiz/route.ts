import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { theme, questionCount, style } = await req.json()

  if (!theme) {
    return NextResponse.json({ error: 'テーマを入力してください' }, { status: 400 })
  }

  const count = questionCount || 5
  const styleInst = style === 'fun' ? '楽しくエンタメ感のある' :
    style === 'medical' ? '医学的で信頼性のある' : 'バランスの取れた'

  const prompt = `大口神経整体院向けの「${theme}」をテーマにした${styleInst}診断クイズを作成してください。

ルール:
- ${count}問の質問を作成
- 各質問は3〜4択
- 各選択肢にポイント（タイプA/B/C等）を割り当て
- 3〜4タイプの診断結果を作成
- 各結果にはタイプ名、説明、アドバイス、おすすめ施術を含める
- 大口神経整体院の強み（神経整体・自律神経調整・睡眠改善）を自然に反映

JSON形式で返してください:
{
  "title": "診断タイトル",
  "description": "診断の説明文",
  "questions": [
    {
      "text": "質問文",
      "choices": [
        {"text": "選択肢", "type": "A"},
        {"text": "選択肢", "type": "B"}
      ]
    }
  ],
  "results": [
    {
      "type": "A",
      "name": "タイプ名",
      "emoji": "絵文字",
      "description": "説明",
      "advice": "アドバイス",
      "treatment": "おすすめ施術"
    }
  ]
}`

  try {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = res.content[0].type === 'text' ? res.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI応答のパースに失敗しました' }, { status: 500 })
    }
    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'クイズ生成エラー' },
      { status: 500 }
    )
  }
}
