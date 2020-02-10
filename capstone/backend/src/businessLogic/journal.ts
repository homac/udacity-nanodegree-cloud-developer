import {JournalEntry} from "../models/JournalEntry";
import {JournalAccess} from "../dataLayer/journalAccess";
import {parseUserId} from "../auth/utils";
import {CreateEntryRequest} from "../requests/CreateEntryRequest";
import {UpdateEntryRequest} from "../requests/UpdateEntryRequest";
import {EntryUpdate} from "../models/EntryUpdate";

const uuidv4 = require('uuid/v4');
const journalAccess = new JournalAccess();
const bucketName = process.env.S3_BUCKET_NAME;

export async function getAllEntries(jwtToken: string): Promise<JournalEntry[]> {
    const userId = parseUserId(jwtToken);
    return journalAccess.getAllEntries(userId);
}

export function createEntry(createEntryRequest: CreateEntryRequest, jwtToken: string): Promise<JournalEntry> {
  const uuid = require('uuid')
  const entryId = uuid.v4()

  const journalEntry = {
    userId: parseUserId(jwtToken),
    entryId: entryId,
    createdAt: new Date().getTime().toString(),
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${entryId}`,
    ...createEntryRequest
  }

    return journalAccess.createEntry(journalEntry);
}

export function updateEntry(updateEntryRequest: UpdateEntryRequest, entryId: string, jwtToken: string): Promise<EntryUpdate> {
    const userId = parseUserId(jwtToken);
    return journalAccess.updateEntry(updateEntryRequest, entryId, userId);
}

export function deleteEntry(entryId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return journalAccess.deleteEntry(entryId, userId);
}

export function generateUploadUrl(entryId: string): Promise<string> {
    return journalAccess.generateUploadUrl(entryId);
}
