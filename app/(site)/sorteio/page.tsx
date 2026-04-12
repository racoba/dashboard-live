import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_GATE_COOKIE,
  verifyAdminGateCookie,
} from "@/src/lib/adminGate";
import RaffleWheelScreen from "@/src/screens/RaffleWheelScreen";

export const metadata: Metadata = {
  title: "Sorteio",
};

export default async function SorteioPage() {
  const store = await cookies();
  const token = store.get(ADMIN_GATE_COOKIE)?.value;
  if (!verifyAdminGateCookie(token, process.env.NEXT_ADMIN_HASH)) {
    redirect("/");
  }
  return <RaffleWheelScreen />;
}
