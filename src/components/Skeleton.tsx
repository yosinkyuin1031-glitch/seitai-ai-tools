'use client'

export function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  )
}

export function BlogGeneratingSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-4" aria-label="ブログ記事を生成中">
      <SkeletonLine className="h-6 w-3/4" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-5/6" />
      <div className="flex gap-2">
        <SkeletonLine className="h-5 w-16 rounded-full" />
        <SkeletonLine className="h-5 w-20 rounded-full" />
        <SkeletonLine className="h-5 w-14 rounded-full" />
      </div>
      <div className="border-t pt-4 space-y-3">
        <SkeletonLine className="h-5 w-1/2" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-4/5" />
        <SkeletonLine className="h-5 w-2/5 mt-2" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export function QuizGeneratingSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-4" aria-label="診断クイズを生成中">
      <SkeletonLine className="h-6 w-2/3" />
      <SkeletonLine className="h-4 w-full" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <SkeletonLine className="h-4 w-4/5" />
            <div className="flex gap-2">
              <SkeletonLine className="h-5 w-20 rounded" />
              <SkeletonLine className="h-5 w-24 rounded" />
              <SkeletonLine className="h-5 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <SkeletonLine className="h-4 w-1/2" />
            <SkeletonLine className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
