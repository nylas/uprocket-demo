import { Contractor, UserData } from "@/lib/types";
import { defineCustomElements } from "@nylas/react";
import { useRef, useState } from "react";

import { useConfirmedTimeslot, usePreBookedEventDetails } from "@/lib/hooks";
import { useRouter } from "next/router";
import { useToast } from "./toast";
import { Button } from "./ui/button";
import LatestTimeslots from "./latest-timeslots";

defineCustomElements();

type SeeMoreTimesProps = {
  contractor: Contractor | undefined;
  selectedDurationInMinutes: number;
  user: UserData | undefined;
};

export default function BookingCard({
  contractor,
  selectedDurationInMinutes,
  user,
}: SeeMoreTimesProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [bookingInfo, setBookingInfo] = useState<any>({});
  const [selectedTimeslot, setSelectedTimeslot] = useState<{
    start_time: Date;
    end_time: Date;
  } | null>(null);
  const { setConfirmedTimeslot } = useConfirmedTimeslot();
  const { setPreBookedEventDetails } = usePreBookedEventDetails();

  const schedulerRef = useRef<HTMLNylasSchedulerElement>(null);

  /**
   * This function is called when the user selects a timeslot.
   * It's an example of how you can use the "eventOverride" functionality
   * in the NylasScheduler component to perform custom actions.
   *
   * In this case, we're overriding the timeslotConfirmed event to
   * perform some checks on the user's state before redirecting them
   * to either the login or checkout page.
   *
   * Note: this function is also utilizing Nylas' new pre-booking feature
   * where we're effectively "holding" the user's selected timeslot. This
   * allows us to perform some additional checks before actually confirming
   * the timeslot.
   */
  const timeslotConfirmedHandler = async (
    timeslot:
      | {
          start_time: Date;
          end_time: Date;
        }
      | undefined
  ) => {
    if (!timeslot) {
      return false;
    }

    // Store selected timeslot in global state
    setConfirmedTimeslot({
      timeslot,
      contractorId: contractor?.uid as string,
      duration: selectedDurationInMinutes,
    });

    if (user?.email && user?.name) {
      const primaryParticipant = {
        name: user?.name,
        email: user?.email,
      };

      // Using our ref to get the scheduler element.
      // With this we can access some of the methods of the scheduler like our store and connector.
      // This gives us a lot more flexibility to customize the scheduler experience to our needs.
      const schedulerElement = schedulerRef.current;

      if (schedulerElement) {
        // We're accessing the store that scheduler uses so that we can directly
        // update the state of the scheduler.
        const schedulerStore = await schedulerElement.getNylasSchedulerStore();
        if (!schedulerStore) {
          return false;
        }

        // These store set methods will automatically trigger the scheduler to re-render
        // and any dependant state variables will be also be re-calculated and updated.
        // Here we are setting the selected timeslot and the booking info so that when we
        // use the connector to book the timeslot, it will use the selected timeslot and
        // the booking info to create the event.
        schedulerStore.set("selectedTimeslot", timeslot);
        schedulerStore.set("bookingInfo", {
          primaryParticipant: primaryParticipant,
        });

        // The scheduler connector is a class that handles all the API calls to the Nylas API
        // as well as update the state of the scheduler. It's an easy way to access the
        // methods used to call the API without having to re-defines functionality.
        const schedulerConnector =
          await schedulerElement.getNylasSchedulerConnector();

        if (!schedulerConnector) {
          return false;
        }

        const bookingDetails =
          await schedulerConnector.scheduler.bookTimeslot();
        if ("error" in bookingDetails) {
          console.error("Booking error", bookingDetails.error);
          addToast(
            bookingDetails.error?.message ?? "Error",
            "Please try again",
            "error"
          );
          return false;
        } else if ("data" in bookingDetails) {
          console.info("Booking details", bookingDetails);
          setPreBookedEventDetails(bookingDetails.data);
          router.push("/checkout");
          return false;
        } else {
          console.error("Unexpected booking error", bookingDetails);
          addToast("Unexpected booking error", "Please try again", "error");
          return false;
        }
      }
      return false;
    } else {
      router.push(`/login?redirect=/contractor/${contractor?.uid}`);
      return false;
    }
  };

  return (
    <>
      <div className="mb-4">
        <LatestTimeslots
          schedulerRef={schedulerRef}
          contractor={contractor}
          bookingInfo={bookingInfo}
          selectedTimeslot={selectedTimeslot}
          setBookingInfo={setBookingInfo}
          selectedDurationInMinutes={selectedDurationInMinutes}
          setSelectedTimeslot={setSelectedTimeslot}
        />
        {/* See more times component goes here */}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        You can share details and message {contractor?.name} after checkout.
      </p>

      <Button
        className="w-full mb-4 hover:bg-gray-50"
        variant="outline"
        onClick={() => {
          if (selectedTimeslot) {
            timeslotConfirmedHandler(selectedTimeslot);
          }
        }}
      >
        Continue (${selectedDurationInMinutes === 30 ? 5 : 10})
      </Button>
    </>
  );
}
