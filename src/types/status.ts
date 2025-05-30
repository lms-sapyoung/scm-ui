export interface Status {
  id: string
  name: string
  color: string
  order: number
  projectId?: string
  groupId?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface StatusGroup {
  id: string
  name: string
  order: number
  projectId?: string
  statuses: Status[]
} 