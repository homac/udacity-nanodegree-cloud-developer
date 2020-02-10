import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { JournalEntry } from '../../models/JournalEntry'

import { parseUserId } from '../../auth/utils'

import {getAllEntries} from "../../businessLogic/journal";

const journalTable = process.env.JOURNAL_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const items = await getAllEntries(jwtToken);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
