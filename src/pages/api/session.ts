import { getUserByUid } from '@/db/users'
import { SESSION_TIME_TO_LIVE } from '@/lib/constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export const sessionRequestSchema = z.object({
  contractor_id: z.string(),
  duration: z.number(),
})

export type SessionRequestData = z.infer<typeof sessionRequestSchema>

export default async function handler(request: NextApiRequest, response: NextApiResponse<any>) {
  const { method } = request

  switch (method) {
    case 'POST':
      return createSession(request, response)
    default:
      response.setHeader('Allow', ['POST'])
      response.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function createSession(request: NextApiRequest, response: NextApiResponse<any>) {
  const { body } = request

  if (!body) {
    return response.status(400).json({ message: 'Missing session data' })
  }

  try {
    const sessionRequestData = sessionRequestSchema.parse(body)
    const duration = sessionRequestData.duration
    // Get user by id
    const user = await getUserByUid(sessionRequestData.contractor_id)
    if (!user) {
      return response.status(400).json({ message: 'Invalid contractor id' })
    }

    // Make sure the user is a contractor
    if (!user.looking_for_work) {
      return response.status(400).json({ message: 'Contractor is not looking for work' })
    }

    // Make sure contractor has a appropriate config
    if (duration == 30 && !user.config_id) {
      return response
        .status(400)
        .json({ message: 'Contractor has not completed their profile for 30 minutes' })
    }
    if (duration == 60 && !user.config_id_60) {
      return response
        .status(400)
        .json({ message: 'Contractor has not completed their profile for 60 minutes' })
    }

    const configID = duration == 30 ? user.config_id : user.config_id_60

    const sessionResponse = await fetch(
      `https://elements-staging.us.nylas.com/v3/grants/${user.grant_id}/scheduling/session_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
        },
        body: JSON.stringify({
          time_to_live: SESSION_TIME_TO_LIVE,
          config_id: configID,
        }),
      },
    )

    const responseData = await sessionResponse.json()
    response.status(200).json(responseData)
  } catch (error) {
    return response.status(400).json({ message: 'Invalid session data' })
  }
}
