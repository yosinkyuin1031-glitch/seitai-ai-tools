'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getContents, toggleFavorite, deleteContent, type SavedContent } from '@/lib/contentApi'
import { showToast } from '@/components/Toast'

const TOOL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  blog: { label: 'ブログ', color: 'bg-blue-100 text-blue-700', icon: '📝' },
  quiz: { label: 'クイズ', color: 'bg-orange-100 text-orange-700', icon: '🎯' },
  diagnosis: { label: '診断', color: 'bg-purple-100 text-purple-700', icon: '🧠' },
}

export default function HistoryPage() {
  const [contents, setContents] = useState<SavedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadContents()
  }, [filter])

  const loadContents = async () => {
    try {
      const data = await getContents(filter === 'all' ? undefined : filter)
      setContents(data)
    } catch {
      showToast('データの読み込みに失敗しました', 'error')
    }
    setLoading(false)
  }

  const handleToggleFavorite = async (item: SavedContent) => {
    try {
      await toggleFavorite(item.id, item.is_favorite)
      setContents(prev => prev.map(c => c.id === item.id ? { ...c, is_favorite: !c.is_favorite } : c))
    } catch {
      showToast('更新に失敗しました', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('削除してよろしいですか？')) return
    try {
      await deleteContent(id)
      setContents(prev => prev.filter(c => c.id !== id))
      showToast('削除しました')
    } catch {
      showToast('削除に失敗しました', 'error')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white">&larr;</Link>
          <h1 className="font-bold">生成履歴</h1>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-auto">{contents.length}件</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'すべて' },
            { key: 'blog', label: '📝 ブログ' },
            { key: 'quiz', label: '🎯 クイズ' },
            { key: 'diagnosis', label: '🧠 診断' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setLoading(true) }}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                filter === f.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-indigo-600 rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 mt-3">読み込み中...</p>
          </div>
        )}

        {!loading && contents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">📂</div>
            <p className="font-bold text-gray-700 mb-2">まだ保存された生成物がありません</p>
            <p className="text-sm text-gray-400">ブログやクイズを生成して保存すると、ここに表示されます</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              ツールを使う
            </Link>
          </div>
        )}

        {!loading && contents.length > 0 && (
          <div className="space-y-3">
            {contents.map(item => {
              const tool = TOOL_LABELS[item.tool_type] || TOOL_LABELS.blog
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{tool.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tool.color}`}>
                          {tool.label}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 truncate">{item.title}</h3>
                      {item.input_data?.keyword ? (
                        <p className="text-xs text-gray-500 mt-1">キーワード: {String(item.input_data.keyword)}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleToggleFavorite(item)}
                        className={`p-1.5 rounded-lg text-sm ${item.is_favorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                        title={item.is_favorite ? 'お気に入り解除' : 'お気に入り'}
                      >
                        ★
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-sm text-gray-300 hover:text-red-500"
                        title="削除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
