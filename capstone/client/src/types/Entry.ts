export interface Entry {
  entryId: string
  createdAt: string
  title: string
  description: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
