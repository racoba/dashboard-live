import type { Metadata } from "next";
import RaffleHistoryScreen from "@/src/screens/RaffleHistoryScreen";

export const metadata: Metadata = {
  title: "Histórico de sorteios",
};

export default function HistoricoPage() {
  return <RaffleHistoryScreen />;
}
