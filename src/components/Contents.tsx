import type { ReactNode } from "react"

interface ContentsProps {
  children: ReactNode
}

export function Contents({ children }: ContentsProps) {
  return (
    <main className="flex-1 container mx-auto p-4">
      {children}
    </main>
  )
} 