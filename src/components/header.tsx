import Link from "next/link";
import { JSX, SVGProps } from "react";

import { useLoggedInUser } from "@/lib/hooks";

export function Header() {
  const { user, isLoading } = useLoggedInUser();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-apple-600">
      <Link className="flex items-center justify-center" href="/">
        <BriefcaseIcon className="h-6 w-6 text-white" />
        <span className="sr-only">UpRocket</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {/* <Link
          className='text-sm font-medium text-white hover:underline underline-offset-4'
          href='#'
        >
          Jobs
        </Link> */}
        <Link
          className="text-sm font-medium text-white hover:underline underline-offset-4"
          href="/contractors"
        >
          Contractors
        </Link>
        {/* <Link
          className='text-sm font-medium text-white hover:underline underline-offset-4'
          href='#'
        >
          Testimonials
        </Link> */}
        {!isLoading && (
          <>
            {user && (
              <>
                <Link
                  className="text-sm font-medium text-white hover:underline underline-offset-4"
                  href="/profile"
                >
                  Profile
                </Link>
                <Link
                  className="text-sm font-medium text-white hover:underline underline-offset-4"
                  href="/api/logout"
                >
                  Log Out
                </Link>
              </>
            )}
            {!user && (
              <Link
                className="text-sm font-medium text-white hover:underline underline-offset-4"
                href="/login"
              >
                Log In
              </Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

function BriefcaseIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
