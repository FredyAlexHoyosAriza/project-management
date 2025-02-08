import Navbar from "@/components/NavBar";
// import { getClient } from "@/lib/apolloClient";
// import Link from "next/link";

export default function Home() { // async
  // const { data } = await getClient().query<CharacterQueryResponse>({ query: characterQuery });
  return (
    <div className="flex flex-col h-screen justify-around">
    <Navbar />
    <main className="h-screen overflow-y-scroll bg-blue-400">
    </main>
  </div>
    // <div className="container">
    //   <h1>Welcome to project Management!!</h1>
    //   <Link href={'/test'}>
    //     <Button label="Haz clic aquí" />
    //   </Link>
    // </div>
  );
}

