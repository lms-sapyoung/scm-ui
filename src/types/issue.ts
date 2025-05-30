export interface Issue {
  id: string
  title: string
  description: string
  projectId: string
  projectName: string
  reporter: {
    id: string
    name: string
    email: string
  }
  assignee?: {
    id: string
    name: string
    email: string
  }
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'high' | 'medium' | 'low' | 'urgent'
  type: 'bug' | 'feature' | 'task' | 'improvement'
  createdAt: Date
  updatedAt: Date
  labels: string[]
  dueDate?: Date
}

export interface IssueFilter {
  search?: string
  status?: Issue['status']
  priority?: Issue['priority']
  type?: Issue['type']
  projectId?: string
  assigneeId?: string
  reporterId?: string
  labels?: string[]
} 