// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getUserData, updateUser } from "@/db/users";
import { validateRequest } from "@/lib/request";
import { CustomApiRequest, UserData } from "@/lib/types";
import { DecodedIdToken } from "firebase-admin/auth";
import type { NextApiResponse } from "next";

export default async function handler(
  request: CustomApiRequest,
  response: NextApiResponse<any>
) {
  const idToken = await validateRequest(request);
  if (idToken === false) {
    return response.status(403).json({ message: "Unauthorized" });
  }

  const { method } = request;

  switch (method) {
    case "GET":
      return getMe(idToken, request, response);
    case "PUT":
      return updateMe(idToken, request, response);
    default:
      response.setHeader("Allow", ["GET"]);
      response.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getMe(
  idToken: DecodedIdToken,
  _request: CustomApiRequest,
  response: NextApiResponse<any>
) {
  // Get user data from the database.-
  const userData = await getUserData(idToken);

  return response.status(200).json(userData);
}

async function updateMe(
  idToken: DecodedIdToken,
  request: CustomApiRequest,
  response: NextApiResponse<any>
) {
  // Get body data.-
  const { body } = request;

  // Parse it as a UserData
  const userData = body as UserData;

  // Validate it.-
  if (!userData) {
    return response.status(400).json({ message: "Missing user data" });
  }

  // Update the user data in the database.-
  await updateUser(idToken, userData);

  return response.status(200).json(userData);
}
