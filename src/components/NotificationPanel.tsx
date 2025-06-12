import { useRef, useEffect } from "react";

const mockNotifications = [
  { id: 1, text: "새 이슈가 할당되었습니다.", read: false, date: "방금 전" },
  { id: 2, text: "프로젝트 설정이 변경되었습니다.", read: false, date: "5분 전" },
  { id: 3, text: "이슈 #2가 완료되었습니다.", read: true, date: "1시간 전" },
];

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50"
    >
      <div className="p-3 border-b font-semibold">알림</div>
      <ul className="max-h-80 overflow-y-auto">
        {mockNotifications.length === 0 && (
          <li className="p-4 text-center text-gray-400">알림이 없습니다.</li>
        )}
        {mockNotifications.map(n => (
          <li
            key={n.id}
            className={`px-4 py-3 border-b last:border-0 text-sm flex justify-between items-center ${
              n.read ? "bg-white" : "bg-blue-50"
            }`}
          >
            <span>{n.text}</span>
            <span className="text-xs text-gray-400">{n.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 