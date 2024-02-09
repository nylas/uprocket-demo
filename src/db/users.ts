import { firebaseFirestoneDb } from '@/lib/firebase-admin'
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

  await firebaseFirestoneDb.doc(`uprocket/${idToken.uid}`).set(transformedUserData)
  return true
}

export async function getUserData(idToken: DecodedIdToken): Promise<UserData | false> {
  const uprocketUserDoc = await firebaseFirestoneDb.doc(`uprocket/${idToken.uid}`).get()
  const transformedUserData: TransformedUserData | undefined = uprocketUserDoc.data() as TransformedUserData | undefined

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
  const uprocketUserDoc = await firebaseFirestoneDb.doc(`uprocket/${uid}`).get()
  const transformedUserData: TransformedUserData | undefined = uprocketUserDoc.data() as TransformedUserData | undefined

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
  const uprocketUsers = await firebaseFirestoneDb.collection(`uprocket`).get()
  const transformedUsers: Record<string, TransformedUserData> | null = {};
  uprocketUsers.forEach((doc) => {
    transformedUsers[doc.id] = doc.data() as TransformedUserData
  })

  if (!transformedUsers) {
    return []
  }

  // Convert object to array.-
  const usersArray: UserData[] = Object.keys(transformedUsers).map((key) => {
    // Transform userData so that 'skills' is an array instead of a string.-
    const userData: UserData = { ...transformedUsers[key], skills: [] }
    if (transformedUsers[key].skills) {
      userData.skills = transformedUsers[key].skills.split(',')
    } else {
      userData.skills = []
    }
    return userData
  })

  return usersArray
}
