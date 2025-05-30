import * as React from "react"
import { cn } from "@/lib/utils"

// Sidebar context for collapsed state
const SidebarContext = React.createContext<{
  collapsed: boolean
  toggle: () => void
} | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const toggle = () => setCollapsed((c) => !c)
  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  return (
    <aside className={cn(
      "h-screen bg-white border-r fixed left-0 top-0 z-40 flex flex-col transition-all duration-200",
      collapsed ? "w-16" : "w-48"
    )}>
      {children}
    </aside>
  )
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, collapsed } = useSidebar()
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "absolute top-4 right-[-16px] z-50 bg-white border rounded-full shadow p-1 hover:bg-muted transition-all",
        className
      )}
      aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
    >
      <span className="sr-only">Toggle sidebar</span>
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        {collapsed ? (
          <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center h-14">{children}</div>
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-3 flex items-center h-14">{children}</div>
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto px-2 py-4">{children}</div>
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{children}</div>
}

export function SidebarGroupContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-1">{children}</ul>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>
}

export function SidebarMenuButton({ asChild = false, children, ...props }: { asChild?: boolean, children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (asChild) return <>{children}</>
  return (
    <button
      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors"
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  // 사이드바 너비만큼 왼쪽 패딩
  return (
    <div className="pl-48 min-h-screen bg-gray-50 flex flex-col">
      {children}
    </div>
  )
} 