/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UXomEPRIXbk
 */
import { Button } from "@/components/ui/button";
import firebaseApp from "@/lib/firebase-client";
import { useLoggedInUser } from "@/lib/hooks";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { JSX, SVGProps, useState } from "react";

export default function LoginBox() {
  const { mutateAccount } = useLoggedInUser();
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();
  const { redirect } = router.query as { redirect: string };

  return (
    <div className="max-w-sm mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">
        Log in to UpRocket
      </h1>
      <Button
        className="w-full bg-blue-500 text-white mb-3"
        disabled={loggingIn}
        onClick={() => {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(firebaseApp);
          setLoggingIn(true);
          signInWithPopup(auth, provider)
            .then(async (result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential =
                GoogleAuthProvider.credentialFromResult(result);
              if (credential) {
                const user = result.user;
                // ...
                await fetch(`/api/login`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    idToken: await user.getIdToken(),
                  }),
                }).then(async (res) => {
                  const data = await res.json();
                  await mutateAccount(data.userData);
                  if (res.status === 200) {
                    router.replace(redirect || "/");
                  }
                });
              }
            })
            .catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              // The email of the user's account used.
              const email = error.customData.email;
              // The AuthCredential type that was used.
              const credential = GoogleAuthProvider.credentialFromError(error);
            })
            .finally(() => {
              setLoggingIn(false);
            });
        }}
      >
        <ChromeIcon className="text-white mr-2" />
        {loggingIn ? "Logging in..." : "Continue with Google"}
      </Button>
    </div>
  );
}

function ChromeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
