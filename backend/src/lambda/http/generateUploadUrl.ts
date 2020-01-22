import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {generateUploadUrl} from "../../businessLogic/todo";

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info("getting pre-signed URL...")
  // DONE: Return a presigned URL to upload a file for a TODO item with the provided id

  const url = await generateUploadUrl(todoId);

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
