// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cookie from 'cookie'
import type { NextApiResponse } from 'next'
import { firebaseAdminAuth } from '@/lib/firebase-admin'
import { CustomApiRequest, UserData } from '@/lib/types'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { getUserData, updateUser } from '@/db/users'

type Data = {
  message: string
  userData?: UserData
}

export default async function handler(request: CustomApiRequest, response: NextApiResponse<Data>) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' })
  }

  const { idToken } = request.body
  if (!idToken) {
    return response.status(400).json({ message: 'ID token is required.' })
  }

  try {
    // Sign in with credential from the Google user.
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await firebaseAdminAuth.createSessionCookie(idToken, { expiresIn })
    const cookieOptions = { maxAge: expiresIn, httpOnly: true, path: '/' }
    const setCookie = cookie.serialize(AUTH_COOKIE_NAME, sessionCookie, cookieOptions)
    response.setHeader('Set-Cookie', setCookie)

    const decodedIdToken = await firebaseAdminAuth.verifySessionCookie(sessionCookie)
    let userData = await getUserData(decodedIdToken)

    if (!userData) {
      const newUser = {
        uid: decodedIdToken.uid,
        name: decodedIdToken.name,
        email: decodedIdToken.email || '',
        picture: decodedIdToken.picture || '',
        title: '',
        website: '',
        looking_for_work: false,
        skills: [],
        success_rate: 0,
        about: '',
        config_id: '',
        config_id_60: '',
        location: '',
        grant_id: '',
        timezone: '',
      }
      await updateUser(decodedIdToken, newUser)
      userData = await getUserData(decodedIdToken)
    }

    if (!userData) {
      return response.status(403).json({ message: 'Unable to log you in' })
    }
    return response.status(200).json({ message: 'Success', userData })
  } catch (error) {
    console.debug(error instanceof Error ? error.message : 'Unknown Error')
    return response.status(403).json({ message: 'Unable to log you in' })
  }
}
