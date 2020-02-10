import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateEntryRequest } from '../../requests/UpdateEntryRequest'

import {updateEntry} from "../../businessLogic/journal";

import { parseUserId } from '../../auth/utils'

const journalTable = process.env.JOURNAL_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const entryId = event.pathParameters.entryId
  const updatedEntry: UpdateEntryRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const result = await updateEntry(updatedEntry, entryId, jwtToken);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      result
    })
  }
}
