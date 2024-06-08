import App from "@/components/App";
import { Inter, Work_Sans } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
const workSans = Work_Sans({ subsets: ["latin"], display: "swap" });

export default function Home() {
  return (
    <>
      <Head>
        <title>Realtime Settlement Negotiation</title>
        <meta
          name="description"
          content="A simple negotiation app that allows two parties to negotiate a settlement in real-time using WebSockets."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`bg-gray-50 ${inter.className} ${workSans.className}`}>
        <App />
      </main>
    </>
  );
}
