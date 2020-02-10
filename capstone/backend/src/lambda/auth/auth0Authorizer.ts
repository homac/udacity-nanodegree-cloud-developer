import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIC/zCCAeegAwIBAgIJZbsK6ebD9EExMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNV
BAMTEmhvbWFjLmV1LmF1dGgwLmNvbTAeFw0yMDAxMjExNDQxMzFaFw0zMzA5Mjkx
NDQxMzFaMB0xGzAZBgNVBAMTEmhvbWFjLmV1LmF1dGgwLmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBANQOk35BQcrcbzHMJu6zlib/UrXxRuSo0zQa
E7qy8GCqxNxaZTxHEbuD7VZ0URRetiz6rGk23lGcYsWS9OmxTs8cCkKM9CKKakdI
GyL4Lh/r92vqf/WXbXQd3kqSL/N2OHtKLLMTveHATTIrQFT3k0KfjMxsQ0kYCzyx
nbN/49nzBK/3777S6Z+a3BwwWfckRft9DvPNNwiubEHYPenf1xtJH9KaL+3r99et
4bSYwS84RAlLJeD86swvQBl5pQ+mLvJK5qoTlO3bO5nhmMTYUb1cVETJzdOEy2Q3
HnFxvmSKeZagn2YfFjP0/BRxkLOQ6ZxszhBqhrCcBFmEeJ0BNsUCAwEAAaNCMEAw
DwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUqW/IiFqymjGbKABMBRcdZ7jQnIkw
DgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQChoZiUy3txqlQkJA7o
TZFEWzPC4+mxmF7GqOz6b9HPAzamRDsV/EbMODwbVoNzDC6S3KV4f2SHRrKl+4dc
ib+wic2aJS7RHh+oek5dTdQXTCNkAXAi/76tAUKbzThX3Tmz9rWxuhYq9vMsge36
pEbjvg9O6rRZweMAhnQ7bMNH9s/Yy1BiAHTe7dzCVFBF7POl6gofV9FgKm7Pghd2
8P896inhJJ/x6YuoWsP7NvQEz2PnRTJ+fjCIVLbw4A/ne1AJzGC7lkPixz8Adcx5
7U3FWzFwn4kAO8znrp21J2g9L6ntiHrhNH9oSXVvdCz/w2XBW0PpfFiqsQIhyruR
6uPd
-----END CERTIFICATE-----`

// DONE: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://homac.eu.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // DONE: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
