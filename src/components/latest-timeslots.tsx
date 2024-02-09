import { BRAND_COLOR, NYLAS_SCHEDULER_API_URL } from "@/lib/constants";
import { Contractor } from "@/lib/types";
import { NylasScheduler } from "@nylas/react";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/button";
import TimeslotsSkeleton from "./timeslots-skeleton";

type SeeMoreTimesProps = {
  contractor: Contractor | undefined;
  selectedDurationInMinutes: number;
  selectedTimeslot: { start_time: Date; end_time: Date } | null;
  setSelectedTimeslot: Dispatch<
    SetStateAction<{
      start_time: Date;
      end_time: Date;
    } | null>
  >;
  bookingInfo: any;
  setBookingInfo: Dispatch<any>;
  schedulerRef: RefObject<HTMLNylasSchedulerElement>;
};

export default function LatestTimeslots({
  contractor,
  selectedDurationInMinutes,
  bookingInfo,
  selectedTimeslot,
  setSelectedTimeslot,
  schedulerRef,
}: SeeMoreTimesProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingTimeslots, setFetchingTimeslots] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeSlots, setTimeslots] = useState<
    { emails: string[]; start_time: number; end_time: number }[] | null
  >(null);

  /**
   * This function creates a session for the contractor's
   * scheduler instance based on the selected duration.
   *
   * This dynamically returns a session id that is passed to the
   * NylasScheduler component which fetches availability and allows
   * the user to book a timeslot based on the contractor's pre-configured
   * availability.
   */
  const createSession = useCallback(async () => {
    if (!contractor) {
      return;
    }
    const createSession: any = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractor_id: contractor.uid,
        duration: selectedDurationInMinutes,
      }),
    });
    const schedulerSession = await createSession.json();
    return schedulerSession?.data?.session_id;
  }, [contractor, selectedDurationInMinutes]);

  /**
   * A utility function to get the first 3 timeslots form
   * the list of available timeslots.
   */
  const getTimeslots = (
    timeslots: { emails: string[]; start_time: number; end_time: number }[]
  ) => {
    if (timeslots) {
      const firstTimeslot = timeslots[0];
      const firstTimeslotDate = new Date(firstTimeslot?.start_time * 1000);
      const filteredTimeslotsForFTD = timeslots?.filter((timeslot) => {
        const startTime = new Date(timeslot.start_time * 1000);
        return (
          startTime.toLocaleDateString() ==
          firstTimeslotDate.toLocaleDateString()
        );
      });
      const firstThreeTimeslots = filteredTimeslotsForFTD?.slice(0, 3);
      return firstThreeTimeslots;
    }
    return null;
  };

  /**
   * Create a session to pass prop sessionId to NylasScheduler
   */
  useEffect(() => {
    // If already initialized, return
    if (loading) {
      return;
    }

    // Create a session to pass prop sessionId to NylasScheduler
    if (!sessionId && contractor) {
      setLoading(true);
      createSession().then((sessionId) => {
        setSessionId(sessionId);
        setLoading(false);
      });
    }
  }, [contractor, createSession, sessionId, loading]);

  /**
   * If selectedDurationInMinutes changes, we will recreate the session
   */
  useEffect(() => {
    if (contractor) {
      setSessionId(null);
    }
  }, [selectedDurationInMinutes, contractor]);

  /**
   * When the session ID is available, we will use the NylasSchedulerConnector
   * (which we can access through the NylasScheduler ref) to fetch the availability.
   * Then we will use the availability to get the first three timeslots and set them
   * in the state.
   */
  useEffect(() => {
    // If no session ID is available, we'll return
    if (!sessionId) {
      return;
    }

    // If we're already fetching timeslots, we'll return
    if (fetchingTimeslots) {
      return;
    }

    // Using our ref to get the scheduler element.
    // With this we can access some of the methods of the scheduler like our store and connector.
    // This gives us a lot more flexibility to customize the scheduler experience to our needs.
    const schedulerElement = schedulerRef.current;
    if (!schedulerElement) {
      return;
    }

    const updateFirstThreeTimeslots = async () => {
      const schedulerConnector =
        await schedulerElement.getNylasSchedulerConnector();
      if (!schedulerConnector) {
        return;
      }

      const availability = await schedulerConnector.scheduler.getAvailability();
      if ("data" in availability) {
        const firstThreeTimeslots = getTimeslots(
          availability?.data?.time_slots
        );
        setTimeslots(firstThreeTimeslots);
      }

      setFetchingTimeslots(false);
    };

    updateFirstThreeTimeslots();
  }, [sessionId, schedulerRef, fetchingTimeslots]);

  // If no session ID is available, we'll render a skeleton loading state of 3 timeslots
  if (!sessionId) {
    return <TimeslotsSkeleton />;
  }

  return (
    <NylasScheduler
      id="nylas-scheduler-provider"
      ref={schedulerRef}
      key={sessionId}
      sessionId={sessionId}
      schedulerApiUrl={NYLAS_SCHEDULER_API_URL}
      themeConfig={{
        "--nylas-primary": BRAND_COLOR,
      }}
      // This mode allows us to prevent the default scheduler
      // UI from loading, effectively making it a provider.
      mode="composable"
      bookingInfo={bookingInfo}
    >
      {(!timeSlots || timeSlots.length === 0) && <TimeslotsSkeleton />}
      {timeSlots && timeSlots.length > 0 && (
        <>
          <p className="font-semibold mb-2">
            {new Date(timeSlots[0]?.start_time * 1000).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "short",
                day: "numeric",
              }
            )}
          </p>
          <div className="flex gap-2">
            {timeSlots?.map((timeslot) => {
              const startTime = new Date(timeslot.start_time * 1000);
              return (
                <Button
                  key={timeslot.start_time}
                  variant="outline"
                  className={`flex-1 ${
                    selectedTimeslot?.start_time.getTime() ===
                    startTime.getTime()
                      ? "bg-apple-600 text-white"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedTimeslot({
                      start_time: startTime,
                      end_time: new Date(
                        startTime.getTime() + selectedDurationInMinutes * 60000
                      ),
                    });
                  }}
                >
                  {startTime.toLocaleTimeString(undefined, {
                    timeStyle: "short",
                  })}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </NylasScheduler>
  );
}
