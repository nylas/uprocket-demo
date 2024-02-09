import { UserData } from "@/lib/types";
import { Header } from "./header";

export default function Dashboard({ user }: { user: UserData }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/** Welcomeing the user */}
            Welcome, {user.name}!
          </div>
        </main>
      </div>
    </div>
  );
}
