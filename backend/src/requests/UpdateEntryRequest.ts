/**
 * Fields in a request to update a single journal entry.
 */
export interface UpdateEntryRequest {
  name: string
  dueDate: string
  done: boolean
}
