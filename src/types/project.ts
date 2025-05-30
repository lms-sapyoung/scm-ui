export interface Project {
  id: string
  name: string
  description: string
  owner: {
    id: string
    name: string
    email: string
  }
  status: 'active' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
  members: Array<{
    id: string
    name: string
    role: 'admin' | 'member' | 'viewer'
  }>
  tags: string[]
}

export interface ProjectFilter {
  search?: string
  status?: Project['status']
  owner?: string
  tags?: string[]
} 