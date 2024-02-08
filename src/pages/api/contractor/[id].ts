import { getContractorByUid } from '@/db/contractors'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return getContractor(req, res)
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

async function getContractor(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string }
  if (!id) {
    return res.status(400).json({ error: 'Missing contractor ID' })
  }
  const contractor = await getContractorByUid(id)
  return res.status(200).json(contractor)
}
