import { firebaseAdminDb } from '@/lib/firebase-admin'
import { Contractor, TransformedUserData } from '@/lib/types'

export async function getContractors(): Promise<Contractor[]> {
  const snapshot = await firebaseAdminDb
    .ref(`uprocket`)
    .child('user')
    .orderByChild('looking_for_work')
    .equalTo(true)
    .get()
  const users: Record<string, TransformedUserData> | null = snapshot.val()

  if (!users) {
    return []
  }

  // Convert object to array.-
  const usersArray: Contractor[] = Object.keys(users).map((key) => {
    const userData: any = users[key]

    // Remove grant_id and config_id from userData.-
    delete userData?.grant_id
    delete userData?.config_id

    // Transform userData so that 'skills' is an array instead of a string.-
    const contractor: Contractor = { ...users[key], skills: [] }
    if (users[key].skills) {
      contractor.skills = users[key].skills.split(',')
    } else {
      contractor.skills = []
    }

    return contractor
  })

  return usersArray
}

export async function getContractorByUid(uid: string): Promise<Contractor | null> {
  const snapshot = await firebaseAdminDb.ref(`uprocket/user/${uid}`).get()
  const transformedUserData: TransformedUserData | null = snapshot.val()

  if (!transformedUserData) {
    return null
  }

  if (!transformedUserData.looking_for_work) {
    return null
  }

  const userData: any = transformedUserData

  // Remove grant_id and config_id from userData.-
  delete userData?.grant_id
  delete userData?.config_id

  // Transform userData so that 'skills' is an array instead of a string.-
  const contractor: Contractor = { ...userData, skills: [] }
  if (transformedUserData.skills) {
    contractor.skills = transformedUserData.skills.split(',')
  } else {
    contractor.skills = []
  }

  return contractor
}
