import { getContractors } from '@/db/contractors'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return getAllContractors(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function getAllContractors(req: NextApiRequest, res: NextApiResponse) {
  const contractors = await getContractors()
  res.status(200).json(contractors)
}
