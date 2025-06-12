import { useState } from "react";
import { Bell, User, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationPanel } from "@/components/NotificationPanel"

export function SiteHeader() {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = 2; // mockNotifications.filter(n => !n.read).length

  return (
    <header className="w-full px-6 py-3 border-b bg-white flex items-center justify-end relative">
      <div className="flex items-center gap-4">
        {/* 이슈 검색 인풋 */}
        <div className="relative max-w-xs">
          <Input className="rounded-full pl-10 pr-4 w-56 border" placeholder="이슈 검색..." />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="알림"
            onClick={() => setNotifOpen(v => !v)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </Button>
          <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
        <Button variant="ghost" size="icon" aria-label="설정">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="사용자 메뉴">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
} 