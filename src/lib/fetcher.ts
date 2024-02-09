import { SchedulingConfig, UpdateConfigData } from "./scheduler-config";
import { Calendar, UserData } from "./types";

export const fetcher = (...args: RequestInfo[]) =>
  fetch(...(args as [RequestInfo])).then((res) => res.json());

export async function getUser(endpoint: string): Promise<UserData> {
  return fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      const error = new Error("An error occurred while fetching the data.");
      throw error;
    }
  });
}

export async function getCalendars(endpoint: string): Promise<Calendar[]> {
  return fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      return [];
    }
  });
}

export async function getSchedulingConfig(
  endpoint: string
): Promise<SchedulingConfig | null> {
  return fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      return null;
    }
  });
}

export async function updateSchedulingConfig(
  endpoint: string,
  { arg }: { arg: Partial<UpdateConfigData> }
): Promise<SchedulingConfig> {
  return fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(arg),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      const error = new Error(
        "An error occurred while updating the user data."
      );
      throw error;
    }
  });
}

export async function updateUser(
  endpoint: string,
  { arg }: { arg: Partial<UserData> }
): Promise<UserData> {
  return fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(arg),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      const error = new Error(
        "An error occurred while updating the user data."
      );
      throw error;
    }
  });
}

export async function getAuthedApiRequest<T>(endpoint: string): Promise<T> {
  return fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        const error = new Error("An error occurred while fetching the data.");
        throw error;
      }
    })
    .then((body) => {
      return body;
    });
}
