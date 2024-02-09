import LoginBox from "@/components/login-box";
import { useLoggedInUser } from "@/lib/hooks";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Login() {
  const { user, isLoading } = useLoggedInUser();
  const router = useRouter();
  if (isLoading) return null;

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Log In - UpRocket</title>
        <meta
          name="description"
          content="Log in to UpRocket to connect with professionals from all over the world and get your projects done"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginBox />
    </>
  );
}
