import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { keyword, mode, tone, length } = await req.json()

  if (!keyword) {
    return NextResponse.json({ error: 'キーワードを入力してください' }, { status: 400 })
  }

  const wordCount = length === 'short' ? '1500' : length === 'long' ? '4000' : '2500'
  const toneInst = tone === 'professional' ? '専門的で信頼感のある文体' :
    tone === 'casual' ? '親しみやすく柔らかい文体' : '丁寧でわかりやすい文体'

  const systemPrompt = `あなたは大口神経整体院のブログライターです。
院の特徴: 神経整体（自律神経・脳神経にアプローチする独自手技）、睡眠改善、頭痛・めまい・自律神経失調症に特化。
院長: 大口陽平（鍼灸師・柔道整復師）

以下のルールに従ってブログ記事を作成してください:
- ${toneInst}
- 約${wordCount}文字
- SEO対策済みのHTMLで出力（h2, h3, p, ul/li タグを使用）
- 症状に悩む患者さんが検索しそうなキーワードを自然に含める
- 最後に来院を促すCTAを含める
- 医学的な断定は避け「改善が期待できます」等の表現を使用

JSON形式で返してください:
{"title": "記事タイトル", "metaDescription": "メタディスクリプション(120文字以内)", "content": "HTML本文", "keywords": ["関連キーワード1", "関連キーワード2"]}`

  const userPrompt = mode === 'symptom'
    ? `「${keyword}」という症状について、原因・対処法・当院での改善方法を解説するブログ記事を作成してください。`
    : `「${keyword}」をテーマに、大口神経整体院のブログ記事を作成してください。`

  try {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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
      { error: e instanceof Error ? e.message : 'ブログ生成エラー' },
      { status: 500 }
    )
  }
}
