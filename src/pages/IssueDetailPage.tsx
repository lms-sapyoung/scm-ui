import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { mockIssues } from './IssuesPage'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/ui/editor'
import type { Issue } from '@/types/issue'

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const issue = mockIssues.find(i => i.id === id)
  const [editedIssue, setEditedIssue] = useState<Issue | null>(issue || null)
  const [editingField, setEditingField] = useState<string | null>(null)

  if (!issue || !editedIssue) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">이슈를 찾을 수 없습니다</h1>
          <p className="mt-2 text-gray-600">요청하신 이슈가 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    // TODO: API 호출로 변경
    console.log('저장된 이슈:', editedIssue)
    setEditingField(null)
  }

  const handleFieldClick = (field: string) => {
    setEditingField(field)
  }

  const handleFieldBlur = () => {
    setEditingField(null)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          뒤로 가기
        </Button>
        <Button onClick={handleSave}>
          저장
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {editedIssue.type === 'bug' && '버그'}
              {editedIssue.type === 'feature' && '기능'}
              {editedIssue.type === 'task' && '작업'}
              {editedIssue.type === 'improvement' && '개선'}
            </Badge>
            {editingField === 'title' ? (
              <Input
                value={editedIssue.title}
                onChange={(e) => setEditedIssue({ ...editedIssue, title: e.target.value })}
                onBlur={handleFieldBlur}
                autoFocus
                className="text-2xl font-bold"
              />
            ) : (
              <h1 
                className="text-2xl font-bold cursor-pointer hover:bg-muted/50 p-1 rounded"
                onClick={() => handleFieldClick('title')}
              >
                {editedIssue.title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">상태</span>
              {editingField === 'status' ? (
                <Select
                  value={editedIssue.status}
                  onValueChange={(value) => {
                    setEditedIssue({ ...editedIssue, status: value as Issue['status'] })
                    setEditingField(null)
                  }}
                  onOpenChange={(open) => !open && setEditingField(null)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">할 일</SelectItem>
                    <SelectItem value="in_progress">진행중</SelectItem>
                    <SelectItem value="resolved">검토중</SelectItem>
                    <SelectItem value="closed">완료</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p 
                  className="cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => handleFieldClick('status')}
                >
                  {editedIssue.status === 'open' && '할 일'}
                  {editedIssue.status === 'in_progress' && '진행중'}
                  {editedIssue.status === 'resolved' && '검토중'}
                  {editedIssue.status === 'closed' && '완료'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">담당자</span>
              {editingField === 'assignee' ? (
                <Input
                  value={editedIssue.assignee?.name || ''}
                  onChange={(e) => setEditedIssue({
                    ...editedIssue,
                    assignee: { ...editedIssue.assignee!, name: e.target.value }
                  })}
                  onBlur={handleFieldBlur}
                  autoFocus
                  className="w-[120px]"
                  placeholder="담당자 이름"
                />
              ) : (
                <p 
                  className="cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => handleFieldClick('assignee')}
                >
                  {editedIssue.assignee?.name || '-'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">기한</span>
              {editingField === 'dueDate' ? (
                <Input
                  type="date"
                  value={editedIssue.dueDate ? format(editedIssue.dueDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEditedIssue({
                    ...editedIssue,
                    dueDate: e.target.value ? new Date(e.target.value) : undefined
                  })}
                  onBlur={handleFieldBlur}
                  autoFocus
                  className="w-[140px]"
                />
              ) : (
                <p 
                  className="cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => handleFieldClick('dueDate')}
                >
                  {editedIssue.dueDate ? format(editedIssue.dueDate, 'yyyy-MM-dd') : '없음'}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">설명</h3>
            <Editor
              content={editedIssue.description}
              onChange={(content) => setEditedIssue({ ...editedIssue, description: content })}
              placeholder="이슈에 대한 설명을 입력하세요..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">라벨</span>
              {editingField === 'labels' ? (
                <Input
                  value={editedIssue.labels.join(', ')}
                  onChange={(e) => setEditedIssue({ ...editedIssue, labels: e.target.value.split(',').map(label => label.trim()) })}
                  onBlur={handleFieldBlur}
                  autoFocus
                  className="w-[200px]"
                  placeholder="라벨을 쉼표로 구분하여 입력하세요"
                />
              ) : (
                <div 
                  className="flex flex-wrap gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => handleFieldClick('labels')}
                >
                  {editedIssue.labels.map((label) => (
                    <Badge key={label} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">보고자</span>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {editedIssue.reporter.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span>{editedIssue.reporter.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'bug':
      return 'bg-red-100 text-red-800'
    case 'feature':
      return 'bg-blue-100 text-blue-800'
    case 'task':
      return 'bg-purple-100 text-purple-800'
    case 'improvement':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'closed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
} 