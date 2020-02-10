export interface JournalEntry {
  userId: string
  entryId: string
  createdAt: string
  title: string
  description: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
