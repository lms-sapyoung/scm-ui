import type { ReactNode } from "react"

interface ContentsProps {
  children: ReactNode
}

export function Contents({ children }: ContentsProps) {
  return (
    <main className="flex-1 w-full p-4">
      {children}
    </main>
  )
} 