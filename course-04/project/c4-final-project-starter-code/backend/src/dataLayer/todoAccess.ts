import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {Types} from 'aws-sdk/clients/s3';
import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";

import { parseUserId } from '../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        console.log("Getting TODOs");

        const result = await this.docClient.query({
          TableName: this.todoTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()

        console.log(result);
        const items = result.Items;

        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        console.log("Creating TODO");

        const params = {
            TableName: this.todoTable,
            Item: todoItem,
        };

        const result = await this.docClient.put(params).promise();
        console.log(result);

        return todoItem as TodoItem;
    }

    async updateTodo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        console.log("Updating TODO");

        const result = await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId.toString()

            },
            UpdateExpression: "set #name=:name, #dueDate=:dueDate, #done=:done",
            ExpressionAttributeNames:{
              "#name": "name",
              "#dueDate": "dueDate",
              "#done": "done"
            },
            ExpressionAttributeValues:{
                ":name": todoUpdate.name,
                ":dueDate": todoUpdate.dueDate,
                ":done": todoUpdate.done
            },
            ReturnValues:"UPDATED_NEW"
          }).promise()

        console.log(result);
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteTodo(todoId: string, userId: string): Promise<string> {
        console.log("Deleting TODO");

        const params = {
          TableName: this.todoTable,
          Key: {
            userId: userId,
            todoId: todoId.toString()
          }
        }

        const result = await this.docClient.delete(params).promise();
        console.log(result);

        return "" as string;
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        console.log("Generating URL");

        const url = this.s3Client.getSignedUrl('putObject', {
          Bucket: this.s3BucketName,
          Key: todoId,
          Expires: 300
        })

        return url as string;
    }
}
