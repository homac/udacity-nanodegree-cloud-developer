import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {generateUploadUrl} from "../../businessLogic/journal";

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

const journalTable = process.env.JOURNAL_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const entryId = event.pathParameters.entryId
  logger.info("getting pre-signed URL...")

  const url = await generateUploadUrl(entryId);

  logger.info("pre-signed URL: ", { URL: url })

  return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          uploadUrl: url
      })
  };
}
