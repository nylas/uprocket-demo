import { ListContractors } from "@/components/list-contractors";
import { useLoggedInUser } from "@/lib/hooks";
import Head from "next/head";

export default function ContractorsPage() {
  const { isLoading } = useLoggedInUser();

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>Contractors - UpRocket</title>
        <meta name="description" content="Contractors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ListContractors />
    </>
  );
}
