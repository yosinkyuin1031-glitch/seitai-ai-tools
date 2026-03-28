'use client'

import { useEffect, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: number
  text: string
  type: ToastType
}

let toastId = 0
let addToastExternal: ((text: string, type?: ToastType) => void) | null = null

export function showToast(text: string, type: ToastType = 'success') {
  addToastExternal?.(text, type)
}

const TOAST_COLORS: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((text: string, type: ToastType = 'success') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    addToastExternal = addToast
    return () => {
      addToastExternal = null
    }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center"
      aria-live="polite"
      role="status"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${TOAST_COLORS[toast.type]} text-white px-5 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-fade-in`}
        >
          {toast.text}
        </div>
      ))}
    </div>
  )
}
