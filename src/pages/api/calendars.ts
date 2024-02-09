// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getUserData } from "@/db/users";
import { NYLAS_API_URL } from "@/lib/constants";
import { validateRequest } from "@/lib/request";
import { UserData } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const idToken = await validateRequest(request);
  if (idToken === false) {
    return response.status(403).json({ message: "Unauthorized" });
  }

  // Get the user data from the decoded token
  const user = await getUserData(idToken);
  if (!user) {
    return response.status(403).json({ message: "Unauthorized" });
  }

  // Ensure the user has a grant_id
  if (!user.grant_id) {
    return response.status(403).json({ message: "Unauthorized" });
  }

  const { method } = request;

  switch (method) {
    case "GET":
      return getCalendars(user, request, response);
    default:
      response.setHeader("Allow", ["GET", "POST", "PUT"]);
      response.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getCalendars(
  user: UserData,
  _request: NextApiRequest,
  response: NextApiResponse
) {
  const { grant_id } = user;

  // Get the config from the database.-
  const configResponse = await fetch(
    `${NYLAS_API_URL}/v3/grants/${grant_id}/calendars`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
      },
    }
  );

  const responseData = await configResponse.json();
  if ("error" in responseData) {
    return response.status(500).json(responseData);
  }

  if ("data" in responseData) {
    return response.status(200).json(responseData["data"]);
  }

  return response.status(500).json("Unknown error");
}
