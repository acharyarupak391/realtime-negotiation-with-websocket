import App from "@/components/App";
import { Inter, Work_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const workSans = Work_Sans({ subsets: ["latin"], display: "swap" });

export default function Home() {
  return (
    <main className={`bg-gray-50 ${inter.className} ${workSans.className}`}>
      <App />
    </main>
  );
}
