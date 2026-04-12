import type { Metadata } from "next";
import AdminScreen from "@/src/screens/AdminScreen";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return <AdminScreen />;
}
