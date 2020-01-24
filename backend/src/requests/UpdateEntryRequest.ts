/**
 * Fields in a request to update a single journal entry.
 */
export interface UpdateEntryRequest {
  title: string
  description: string
  dueDate: string
  done: boolean
}
