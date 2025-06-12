import React, { useState } from "react";
import { ProjectSelector, type Project } from '@/components/ProjectSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Plus, Settings, Search } from 'lucide-react';

// Mock 데이터
const mockProjects: Project[] = [
  { id: "1", name: "2024 신규 서비스" },
  { id: "2", name: "시스템 개선" },
];
const currentUser = { id: '1', name: '홍길동' };
const mockIssues = [
  { id: '1', title: '로그인 구현', status: 'in_progress', assigneeId: '1', dueDate: new Date(Date.now() + 86400000), projectId: '1' },
  { id: '2', title: '버그 수정', status: 'done', assigneeId: '1', dueDate: new Date(Date.now() - 86400000), projectId: '1' },
  { id: '3', title: 'UI 개선', status: 'review', assigneeId: '2', dueDate: new Date(Date.now() + 2 * 86400000), projectId: '2' },
  { id: '4', title: 'API 연동', status: 'in_progress', assigneeId: '1', dueDate: new Date(Date.now() + 3 * 86400000), projectId: '1' },
  { id: '5', title: '문서화', status: 'todo', assigneeId: '1', dueDate: new Date(Date.now() + 5 * 86400000), projectId: '2' },
];
const mockLogs = [
  { id: 1, text: '이슈 #1 로그인 구현 완료', date: '2024-04-01' },
  { id: 2, text: '이슈 #2 버그 수정 완료', date: '2024-03-31' },
  { id: 3, text: '이슈 #3 UI 개선 리뷰 요청', date: '2024-03-30' },
];

const statusLabels: Record<string, string> = {
  in_progress: '진행중',
  done: '완료',
  review: '검토필요',
  todo: '할 일',
};

export default function DashboardPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(mockProjects[0].id);
  // 실제 서비스라면 전역 selectedProjectId, currentUser 사용
  const issues = mockIssues.filter(i => i.projectId === selectedProjectId || !i.projectId);
  const myIssues = issues.filter(i => i.assigneeId === currentUser.id);
  const stats = {
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    done: issues.filter(i => i.status === 'done').length,
    review: issues.filter(i => i.status === 'review').length,
    due_soon: issues.filter(i => i.dueDate && (i.dueDate.getTime() - Date.now()) < 3 * 86400000 && i.dueDate > new Date()).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* 상단: 제목(왼쪽) + 프로젝트 선택(오른쪽) */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">프로젝트 대시보드</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 좌측: 이슈 통계 카드 */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">진행중</span>
            <span className="text-2xl font-bold text-blue-600">{stats.in_progress}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">완료</span>
            <span className="text-2xl font-bold text-green-600">{stats.done}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">검토필요</span>
            <span className="text-2xl font-bold text-purple-600">{stats.review}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">마감임박</span>
            <span className="text-2xl font-bold text-red-600">{stats.due_soon}</span>
          </div>
        </div>
        {/* 중앙: 내 이슈/최근 활동 */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">내가 처리해야 할 이슈</span>
              <span className="text-xs text-gray-400">{myIssues.length}건</span>
            </div>
            <ul className="divide-y">
              {myIssues.length === 0 && <li className="text-gray-400 py-4 text-center">할당된 이슈가 없습니다.</li>}
              {myIssues.map(issue => (
                <li key={issue.id} className="py-2 flex items-center gap-2">
                  <span className="text-sm font-medium">{issue.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{statusLabels[issue.status]}</span>
                  {issue.dueDate && <span className="text-xs text-red-500 ml-2">D-{Math.ceil((issue.dueDate.getTime() - Date.now())/86400000)}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-2">최근 활동</div>
            <ul className="divide-y">
              {mockLogs.map(log => (
                <li key={log.id} className="py-2 text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400 text-xs">{log.date}</span>
                  <span>{log.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 