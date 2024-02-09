import { BRAND_COLOR, NYLAS_SCHEDULER_API_URL } from "@/lib/constants";
import { Contractor, UserData } from "@/lib/types";
import { NylasScheduler } from "@nylas/react";
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

type SeeMoreTimesProps = {
  contractor: Contractor | undefined;
  selectedDurationInMinutes: number;
  user: UserData | undefined;
  bookingInfo: any;
  selectedTimeslot: { start_time: Date; end_time: Date } | null;
  setBookingInfo: Dispatch<any>;
  timeslotConfirmedHandler: (
    timeslot: { start_time: Date; end_time: Date } | undefined
  ) => Promise<boolean>;
};

export default function SeeMoreTimes({
  contractor,
  selectedDurationInMinutes,
  user,
  bookingInfo,
  selectedTimeslot,
  setBookingInfo,
  timeslotConfirmedHandler,
}: SeeMoreTimesProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [showScheduler, setShowScheduler] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const schedulerRef = useRef<HTMLNylasSchedulerElement>(null);

  /**
   * This function creates a session for the contractor's
   * scheduler instance based on the selected duration.
   *
   * This dynamically creates a session that is passed to the
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
   * Update bookingInfo when user changes
   */
  useEffect(() => {
    setBookingInfo({
      primaryParticipant: {
        name: user?.name,
        email: user?.email,
      },
    });
  }, [user, setBookingInfo]);

  return (
    <Dialog open={showScheduler} onOpenChange={() => setShowScheduler(false)}>
      <Button
        variant={"link"}
        onClick={() => setShowScheduler(true)}
        className="p-0 text-blue-600 dark:text-blue-500"
      >
        See more times
      </Button>
      <DialogContent className="h-[575px] p-0 overflow-hidden">
        {sessionId && (
          <NylasScheduler
            key={sessionId}
            ref={schedulerRef}
            mode="app"
            sessionId={sessionId}
            schedulerApiUrl={NYLAS_SCHEDULER_API_URL}
            themeConfig={{
              "--nylas-primary": BRAND_COLOR,
            }}
            bookingInfo={bookingInfo}
            eventOverrides={{
              timeslotConfirmed: async (event) => {
                event.preventDefault();
                timeslotConfirmedHandler(event.detail);
              },
            }}
          >
            <span slot="timeslot-picker-cta-label">Confirm</span>
          </NylasScheduler>
        )}

        {!sessionId && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
