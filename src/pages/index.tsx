import Dashboard from "@/components/dashboard";
import { LandingPage } from "@/components/landing-page";
import { useLoggedInUser } from "@/lib/hooks";
import Head from "next/head";

export default function Home() {
  const { user, isLoading } = useLoggedInUser();

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>UpRocket</title>
        <meta
          name="description"
          content="Connect with professionals from all over the world and get your projects done
                  efficiently and effectively."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? <Dashboard user={user} /> : <LandingPage />}
    </>
  );
}
