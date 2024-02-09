import { getUserByUid } from '@/db/users'
import { validateRequest } from '@/lib/request'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NYLAS_SCHEDULER_API_URL, SESSION_TIME_TO_LIVE } from '@/lib/constants'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { method } = request
  switch (method) {
    case 'POST':
      if (method === 'POST') {
        return confirmPreBooking(request, response)
      }
      break
    default:
      response.setHeader('Allow', ['POST'])
      response.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function confirmPreBooking(request: NextApiRequest, response: NextApiResponse<any>) {
  const { bookingId } = request.query

  if (!bookingId) {
    return response.status(400).json({ message: 'Invalid booking id' })
  }

  const body = request.body
  if (!body || !body.contractorId) {
    return response.status(400).json({ message: 'Please provide contractor id' })
  }

  const idToken = await validateRequest(request)
  if (idToken === false) {
    return response.status(403).json({ message: 'Unauthorized' })
  }

  try {
    // Get user by id
    const user = await getUserByUid(body.contractorId)

    if (!user) {
      return response.status(400).json({ message: 'Invalid contractor id' })
    }

    // Make sure the user is a contractor
    if (!user.looking_for_work) {
      return response.status(400).json({ message: 'Contractor is not looking for work' })
    }

    // Make sure contractor has a config
    if (!user.config_id) {
      return response.status(400).json({ message: 'Contractor has not completed their profile' })
    }

    const confirmBookingResponse = await fetch(
      `${NYLAS_SCHEDULER_API_URL}/v3/grants/${user.email}/scheduling/bookings/${bookingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
        },
        body: JSON.stringify({
          action: 'confirm',
        }),
      },
    )

    const responseData = await confirmBookingResponse.json()
    response.status(200).json(responseData)
  } catch (error) {
    return response.status(400).json({ message: 'Invalid session data' })
  }
}
