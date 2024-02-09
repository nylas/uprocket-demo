import { updateConfigSchema, schedulingConfig } from "@/lib/scheduler-config";
import { getUserData, updateUser } from "@/db/users";
import { NYLAS_SCHEDULER_API_URL } from "@/lib/constants";
import { validateRequest } from "@/lib/request";
import { UserData } from "@/lib/types";
import { DecodedIdToken } from "firebase-admin/auth";
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
      return getConfig(user, request, response);
    case "PUT":
      return setConfig(idToken, user, request, response);
    case "POST":
      return setConfig(idToken, user, request, response);
    default:
      response.setHeader("Allow", ["GET", "POST", "PUT"]);
      response.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getConfig(
  user: UserData,
  _request: NextApiRequest,
  response: NextApiResponse
) {
  const { grant_id, config_id } = user;

  // Ensure the user has a config_id
  if (!config_id) {
    return response.status(403).json({ message: "Configuration not created" });
  }

  // Ensure the user has a config_id
  if (!grant_id) {
    return response.status(403).json({ message: "Configuration incomplete" });
  }

  // Get the config from the database.-
  const configResponse = await fetch(
    `${NYLAS_SCHEDULER_API_URL}/v3/grants/${grant_id}/scheduling/configuration/${config_id}`,
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
    return response.status(200).json(responseData["data"]["data"]);
  }

  return response.status(500).json("Unknown error");
}

async function setConfig(
  idToken: DecodedIdToken,
  user: UserData,
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { grant_id, config_id, config_id_60 } = user;

  // Validate the request body.-
  const { body } = request;
  if (!body) {
    return response.status(400).json({ message: "Invalid request" });
  }
  // Validate the request body.-
  try {
    const requestConfig = updateConfigSchema.parse(body);

    // If the user doesn't have a config_id, create one.-
    const config = {
      ...schedulingConfig,
      availability: {
        ...schedulingConfig.availability,
        participants: [
          {
            name: user.name,
            email: user.email,
            calendar_ids: requestConfig.availability_calendar_ids,
            open_hours: requestConfig.availability_open_hours,
          },
        ],
      },
      event_booking: {
        ...schedulingConfig.event_booking,
        ...(requestConfig.event_title
          ? { title: requestConfig.event_title }
          : {}),
        ...(requestConfig.event_description
          ? { description: requestConfig.event_description }
          : {}),
        organizer: {
          email: user.email,
          calendar_id: requestConfig.booking_calendar_id,
        },
      },
    };

    const { data: data_30, status: status_30 } = await createOrUpdateConfig(
      config,
      30,
      grant_id,
      config_id
    );

    const { data: data_60, status: status_60 } = await createOrUpdateConfig(
      config,
      60,
      grant_id,
      config_id_60
    );

    // Update the user
    await updateUser(idToken, {
      ...user,
      config_id: data_30.id,
      config_id_60: data_60.id,
    });

    if (status_30 !== 200) {
      return response.status(status_30).json(data_30);
    }

    if (status_60 !== 200) {
      return response.status(status_60).json(data_60);
    }

    return response.status(200).json(data_30);
  } catch (error) {
    return response.status(400).json({ message: "Invalid request" });
  }
}

async function createOrUpdateConfig(
  config: any,
  duration: number,
  grant_id: string,
  config_id?: string
) {
  config["availability"]["duration_minutes"] = duration;
  if (!config_id) {
    const configResponse = await fetch(
      `${NYLAS_SCHEDULER_API_URL}/v3/grants/${grant_id}/scheduling/configuration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
        },
        body: JSON.stringify({
          data: config,
        }),
      }
    );

    const responseData = await configResponse.json();
    if ("error" in responseData) {
      return {
        status: 500,
        data: responseData,
      };
    }

    if ("data" in responseData) {
      const config = responseData["data"];
      return {
        status: 200,
        data: config,
      };
    }

    return {
      status: 500,
      data: "Unknown error",
    };
  } else {
    const configResponse = await fetch(
      `${NYLAS_SCHEDULER_API_URL}/v3/grants/${grant_id}/scheduling/configuration/${config_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NYLAS_API_KEY}`,
        },
        body: JSON.stringify({
          data: config,
        }),
      }
    );

    const responseData = await configResponse.json();
    if ("error" in responseData) {
      return {
        status: 500,
        data: responseData,
      };
    }

    if ("data" in responseData) {
      const config = responseData["data"];
      return {
        status: 200,
        data: config,
      };
    }

    return {
      status: 500,
      data: "Unknown error",
    };
  }
}
