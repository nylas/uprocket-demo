import { AUTH_COOKIE_NAME } from "./constants";
import { firebaseAdminAuth } from "./firebase-admin";
import { CustomApiRequest } from "./types";

export async function validateRequest(request: CustomApiRequest) {
  const idToken = request.cookies[AUTH_COOKIE_NAME];
  if (!idToken) {
    return false;
  }

  try {
    const decodedToken = await firebaseAdminAuth.verifySessionCookie(
      idToken,
      true
    );
    return decodedToken;
  } catch (error) {
    return false;
  }
}
