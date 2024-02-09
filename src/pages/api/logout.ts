// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cookie from "cookie";
import type { NextApiResponse } from "next";
import { CustomApiRequest } from "@/lib/types";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

type Data = {
  message: string;
};

export default async function handler(
  request: CustomApiRequest,
  response: NextApiResponse<Data>
) {
  if (request.method === "GET") {
    try {
      const expiresIn = -1;
      const cookieOptions = { maxAge: expiresIn, httpOnly: true, path: "/" };
      const setCookie = cookie.serialize(AUTH_COOKIE_NAME, "", cookieOptions);
      response.setHeader("Set-Cookie", setCookie);
      return response.redirect("/");
    } catch (error) {
      return response.status(500).json({ message: "Unable to log you out" });
    }
  }

  return response.status(405).json({ message: "Method not allowed" });
}
