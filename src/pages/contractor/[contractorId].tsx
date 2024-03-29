/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/gm9IVzUFhps
 */
import BookingCard from "@/components/booking-card";
import { Header } from "@/components/header";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DURATIONS_AND_PRICES } from "@/lib/constants";
import { useContractor, useLoggedInUser } from "@/lib/hooks";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ContractorPage() {
  const { isLoading } = useLoggedInUser();
  const router = useRouter();
  const { contractorId } = router.query as { contractorId: string };
  const { user } = useLoggedInUser();
  const { contractor } = useContractor(contractorId);
  const [selectedDurationInMinutes, setSelectedDurationInMinutes] =
    useState<number>(30);

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>Contractor - UpRocket</title>
        <meta name="description" content="Contractor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl p-[48px] mx-auto px-6 sm:px-6 lg:px-8">
          {/* Back button to contractors list */}

          <Link
            href="/contractors"
            className="text-apple-600 hover:underline block mb-6"
          >
            ← Back to contractors
          </Link>

          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-full md:col-span-2">
              <h1 className="text-3xl font-semibold mb-6">
                {contractor?.title} Consultation with {contractor?.name}
              </h1>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  About {contractor?.name}
                </h2>
              </div>
              <div className="flex items-center mb-4">
                <Avatar>
                  {!contractor?.picture && (
                    <AvatarImage
                      alt="Profile picture"
                      src="/placeholder.svg?height=40&width=40"
                    />
                  )}
                  {contractor?.picture && (
                    <AvatarImage
                      alt="Profile picture"
                      src={`${contractor?.picture}?height=40&width=40`}
                    />
                  )}
                </Avatar>
                <div className="ml-4">
                  <h3 className="font-semibold">{contractor?.title}</h3>
                  <p className="text-gray-600">
                    {contractor?.location} -{" "}
                    {Intl.DateTimeFormat(undefined, {
                      timeZone: contractor?.timezone,
                      timeStyle: "short",
                    }).format(new Date())}{" "}
                    local time
                  </p>
                </div>
              </div>
              <p className="mb-6">
                {contractor?.about
                  .split(new RegExp(/\n/))
                  .map((paragraph, index) => (
                    <span key={index}>
                      {paragraph}
                      <br />
                    </span>
                  ))}
              </p>
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {contractor?.skills?.map((skill) => (
                  <Badge variant="outline" key={skill}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="col-span-full md:col-span-1">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Choose how long to meet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <RadioGroup
                      defaultValue="30"
                      onValueChange={(value) =>
                        setSelectedDurationInMinutes(parseInt(value))
                      }
                    >
                      {DURATIONS_AND_PRICES.map((durationAndPrice) => (
                        <div
                          className="flex items-center space-x-2"
                          key={durationAndPrice.duration}
                        >
                          <RadioGroupItem
                            value={durationAndPrice.duration.toString()}
                          />
                          <Label htmlFor="duration-30">
                            {durationAndPrice.duration.toString()} minutes
                          </Label>
                          <span className="ml-auto">
                            ${durationAndPrice.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <BookingCard
                    contractor={contractor}
                    selectedDurationInMinutes={selectedDurationInMinutes}
                    user={user}
                  />
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-600">
                    You&apos;re covered with payment protection so you can
                    cancel and get a full refund up to 24 hours before your
                    consultation.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
