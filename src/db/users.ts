import { firebaseAdminDb } from '@/lib/firebase-admin'
import { TransformedUserData, UserData } from '@/lib/types'
import { DecodedIdToken } from 'firebase-admin/auth'

export async function updateUser(idToken: DecodedIdToken, userData: UserData): Promise<boolean> {
  const transformedUserData: TransformedUserData = { ...userData, skills: '' }
  // Transform userData so that 'skills' is a string instead of an array.-
  if (userData.skills) {
    transformedUserData.skills = userData.skills.join(',')
  } else {
    transformedUserData.skills = ''
  }

  await firebaseAdminDb.ref(`uprocket/user/${idToken.uid}`).set(transformedUserData)
  return true
}

export async function getUserData(idToken: DecodedIdToken): Promise<UserData | false> {
  const snapshot = await firebaseAdminDb.ref(`uprocket/user/${idToken.uid}`).get()
  const transformedUserData: TransformedUserData | null = snapshot.val()

  if (!transformedUserData) {
    return false
  }

  // Transform userData so that 'skills' is an array instead of a string.-
  const userData: UserData = { ...transformedUserData, skills: [] }
  if (transformedUserData.skills) {
    userData.skills = transformedUserData.skills.split(',')
  } else {
    userData.skills = []
  }

  return userData
}

export async function getUserByUid(uid: string): Promise<UserData | null> {
  const snapshot = await firebaseAdminDb.ref(`uprocket/user/${uid}`).get()
  const transformedUserData: TransformedUserData | null = snapshot.val()

  if (!transformedUserData) {
    return null
  }

  // Transform userData so that 'skills' is an array instead of a string.-
  const userData: UserData = { ...transformedUserData, skills: [] }
  if (transformedUserData.skills) {
    userData.skills = transformedUserData.skills.split(',')
  } else {
    userData.skills = []
  }

  return userData
}

export async function getUsers(): Promise<UserData[]> {
  const snapshot = await firebaseAdminDb.ref(`uprocket`).child('user').get()
  const users: Record<string, TransformedUserData> | null = snapshot.val()

  if (!users) {
    return []
  }

  // Convert object to array.-
  const usersArray: UserData[] = Object.keys(users).map((key) => {
    // Transform userData so that 'skills' is an array instead of a string.-
    const userData: UserData = { ...users[key], skills: [] }
    if (users[key].skills) {
      userData.skills = users[key].skills.split(',')
    } else {
      userData.skills = []
    }
    return userData
  })

  return usersArray
}
