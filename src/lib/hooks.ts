import useSWR, { Key } from "swr";
import useSWRMutation from "swr/mutation";

import { SchedulingConfig, UpdateConfigData } from "./scheduler-config";
import {
  fetcher,
  getAuthedApiRequest,
  getUser,
  updateSchedulingConfig,
  updateUser,
} from "./fetcher";
import { Calendar, UserData } from "./types";

export function useLoggedInUser() {
  const { data, error, mutate, isValidating } = useSWR("/api/me", getUser);
  return {
    user: data,
    isLoading: !error && !data,
    isValidating,
    isError: error,
    mutateAccount: mutate,
  };
}

export function useUpdateUser() {
  const { data, error, trigger, isMutating } = useSWRMutation(
    "/api/me",
    updateUser,
    {}
  );
  return {
    user: data,
    isLoading: !error && !data,
    isMutating,
    isError: error,
    updateUser: trigger,
  };
}

export function useContractors() {
  const { data, error, mutate, isValidating } = useSWR(
    "/api/contractor",
    getAuthedApiRequest<UserData[]>
  );
  return {
    contractors: data,
    isLoading: !error && !data,
    isValidating,
    isError: error,
    mutateContractors: mutate,
  };
}

export function useContractor(id: string) {
  const { data, error, mutate, isValidating } = useSWR(
    `/api/contractor/${id}`,
    getAuthedApiRequest<UserData>
  );
  return {
    contractor: data,
    isLoading: !error && !data,
    isValidating,
    isError: error,
    mutateContractor: mutate,
  };
}

export function useSchedulingConfig() {
  const { data, error, mutate, isValidating } = useSWR<
    Partial<SchedulingConfig>
  >("/api/config", fetcher);
  return {
    config: data,
    isConfigLoading: !error && !data,
    isConfigValidating: isValidating,
    isConfigError: error,
    mutateConfig: mutate,
  };
}

export function useUpdateSchedulingConfig() {
  const { data, error, trigger, isMutating } = useSWRMutation<
    SchedulingConfig,
    any,
    Key,
    UpdateConfigData,
    SchedulingConfig
  >("/api/config", updateSchedulingConfig);
  return {
    config: data,
    isConfigLoading: !error && !data,
    isConfigMutating: isMutating,
    isConfigError: error,
    updateConfig: trigger,
  };
}

export function useCalendars() {
  const { data, error, mutate, isValidating } = useSWR(
    "/api/calendars",
    getAuthedApiRequest<Calendar[]>
  );
  return {
    calendars: data,
    isLoading: !error && !data,
    isValidating,
    isError: error,
    mutateCalendars: mutate,
  };
}

export const useConfirmedTimeslot = () => {
  const { data, mutate } = useSWR("confirmedTimeslot", { fallbackData: null });

  const setConfirmedTimeslot = (data: {
    timeslot: {
      start_time: Date;
      end_time: Date;
    };
    contractorId: string;
    duration: number;
  }) => {
    const { timeslot, contractorId, duration } = data;
    mutate(
      {
        timeslot,
        contractorId,
        duration,
      },
      false
    );
  };

  const unsetTimeslot = () => {
    mutate(null, false);
  };

  return {
    confirmedTimeslot: data,
    setConfirmedTimeslot,
    unsetTimeslot,
  };
};

export const useAdditionalFields = () => {
  const { data, mutate } = useSWR("additionalFields", { fallbackData: null });

  const setAdditionalFields = (additionalFields: any) => {
    mutate(additionalFields, false);
  };

  return {
    additionalFields: data,
    setAdditionalFields,
  };
};

export const usePreBookedEventDetails = () => {
  const { data, mutate } = useSWR("preBookedEventDetails", {
    fallbackData: null,
  });

  const setPreBookedEventDetails = (preBookedEventDetails: any) => {
    mutate(preBookedEventDetails, false);
  };

  return {
    preBookedEventDetails: data,
    setPreBookedEventDetails,
  };
};

export const useConfirmedBookingDetails = () => {
  const { data, mutate } = useSWR("confirmedBookingDetails", {
    fallbackData: null,
  });

  const setConfirmedBookingDetails = (confirmedBookingDetails: any) => {
    mutate(confirmedBookingDetails, false);
  };

  return {
    confirmedBookingDetails: data,
    setConfirmedBookingDetails,
  };
};
