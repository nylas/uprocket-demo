import * as firebaseAdmin from "firebase-admin";
import { FIREBASE_ADMIN_DATABASE_URL } from "./constants";

function createApp() {
  const serviceAccountString = Buffer.from(
    (process.env.SERVICE_ACCOUNT as string) ?? "",
    "base64"
  ).toString("ascii");
  try {
    const serviceAccount = JSON.parse(serviceAccountString);

    const firebaseConfig = {
      credential: firebaseAdmin.credential.cert(
        serviceAccount as firebaseAdmin.ServiceAccount
      ),
      databaseURL: FIREBASE_ADMIN_DATABASE_URL,
    };

    try {
      return firebaseAdmin.app("nylas-admin-app");
    } catch {
      return firebaseAdmin.initializeApp(firebaseConfig, "nylas-admin-app");
    }
  } catch (error) {
    console.error("Unable to parse service account JSON");
    throw error;
  }
}
export const firebaseAdminApp = createApp();
export const firebaseAdminAuth = firebaseAdmin.auth(firebaseAdminApp);
export const firebaseFirestoneDb = firebaseAdmin.firestore(firebaseAdminApp);
