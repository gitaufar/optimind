import type { ReactNode } from 'react'

export default function Card({ title, children, right, className }: { title?: string; children: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm ${className ?? ''}`}>
      {(title || right) && (
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="font-semibold">{title}</div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
