import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {Types} from 'aws-sdk/clients/s3';
import {JournalEntry} from "../models/JournalEntry";
import {EntryUpdate} from "../models/EntryUpdate";

import { parseUserId } from '../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)

export class JournalAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly journalTable = process.env.JOURNAL_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getAllEntries(userId: string): Promise<JournalEntry[]> {
        console.log("Getting all journal entries");

        const result = await this.docClient.query({
          TableName: this.journalTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()

        console.log(result);
        const items = result.Items;

        return items as JournalEntry[]
    }

    async createEntry(journalEntry: JournalEntry): Promise<JournalEntry> {
        console.log("Creating journal entry");

        const params = {
            TableName: this.journalTable,
            Item: journalEntry,
        };

        const result = await this.docClient.put(params).promise();
        console.log(result);

        return journalEntry as JournalEntry;
    }

    async updateEntry(entryUpdate: EntryUpdate, entryId: string, userId: string): Promise<EntryUpdate> {
        console.log("Updating journal entry");

        const result = await this.docClient.update({
            TableName: this.journalTable,
            Key: {
                "userId": userId,
                "entryId": entryId.toString()

            },
            UpdateExpression: "set #title=:title, #description=:description, #dueDate=:dueDate, #done=:done",
            ExpressionAttributeNames:{
              "#title": "title",
              "#description": "description",
              "#dueDate": "dueDate",
              "#done": "done"
            },
            ExpressionAttributeValues:{
                ":title": entryUpdate.title,
                ":description": entryUpdate.description,
                ":dueDate": entryUpdate.dueDate,
                ":done": entryUpdate.done
            },
            ReturnValues:"UPDATED_NEW"
          }).promise()

        console.log(result);
        const attributes = result.Attributes;

        return attributes as EntryUpdate;
    }

    async deleteEntry(entryId: string, userId: string): Promise<string> {
        console.log("Deleting journal entry");

        const params = {
          TableName: this.journalTable,
          Key: {
            userId: userId,
            entryId: entryId.toString()
          }
        }

        const result = await this.docClient.delete(params).promise();
        console.log(result);

        return "" as string;
    }

    async generateUploadUrl(entryId: string): Promise<string> {
        console.log("Generating URL");

        const url = this.s3Client.getSignedUrl('putObject', {
          Bucket: this.s3BucketName,
          Key: entryId,
          Expires: 300
        })

        return url as string;
    }
}
