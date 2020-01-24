import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateEntryRequest } from '../../requests/CreateEntryRequest'

import {createEntry} from "../../businessLogic/journal";

const journalTable = process.env.JOURNAL_TABLE
const bucketName = process.env.S3_BUCKET_NAME

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("Processing Event ", event);

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newEntry: CreateEntryRequest = JSON.parse(event.body)
  const journalEntry = await createEntry(newEntry, jwtToken)

  return {
      statusCode: 201,
      headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          "item": journalEntry
      }),
  }
}
