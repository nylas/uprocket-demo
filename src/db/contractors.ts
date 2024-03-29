import { firebaseFirestoneDb } from "@/lib/firebase-admin";
import { Contractor, TransformedUserData } from "@/lib/types";

export async function getContractors(): Promise<Contractor[]> {
  const uprocketUsers = await firebaseFirestoneDb.collection(`uprocket`).where('looking_for_work', '==', true).get();
  const users: Record<string, TransformedUserData> | null = {};
  uprocketUsers.forEach((doc) => {
    users[doc.id] = doc.data() as TransformedUserData;
  });

  if (!users) {
    return [];
  }

  // Convert object to array.-
  const usersArray: Contractor[] = Object.keys(users).map((key) => {
    const userData: any = users[key];

    // Remove grant_id and config_id from userData.-
    delete userData?.grant_id;
    delete userData?.config_id;

    // Transform userData so that 'skills' is an array instead of a string.-
    const contractor: Contractor = { ...users[key], skills: [] };
    if (users[key].skills) {
      contractor.skills = users[key].skills.split(",");
    } else {
      contractor.skills = [];
    }

    return contractor;
  });

  return usersArray;
}

export async function getContractorByUid(
  uid: string
): Promise<Contractor | null> {
  const uprocketUserDoc = await firebaseFirestoneDb
    .doc(`uprocket/${uid}`)
    .get();
  const transformedUserData: TransformedUserData | undefined =
    uprocketUserDoc.data() as TransformedUserData | undefined;

  if (!transformedUserData) {
    return null;
  }

  if (!transformedUserData.looking_for_work) {
    return null;
  }

  const userData: any = transformedUserData;

  // Remove grant_id and config_id from userData.-
  delete userData?.grant_id;
  delete userData?.config_id;

  // Transform userData so that 'skills' is an array instead of a string.-
  const contractor: Contractor = { ...userData, skills: [] };
  if (transformedUserData.skills) {
    contractor.skills = transformedUserData.skills.split(",");
  } else {
    contractor.skills = [];
  }

  return contractor;
}
