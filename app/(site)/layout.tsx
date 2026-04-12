import type { Metadata } from "next";
import SiteChrome from "@/src/components/layout/SiteChrome";
import { envIsTruthy } from "@/src/lib/envFlags";

export const metadata: Metadata = {
  title: {
    default: "Dashboard Live",
    template: "%s · Dashboard Live",
  },
  description:
    "Inscrição no sorteio, histórico e roleta ao vivo. 1$ = 1 ticket.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showAdminButton = envIsTruthy(process.env.NEXT_SHOW_ADMIN);
  return (
    <SiteChrome showAdminButton={showAdminButton}>{children}</SiteChrome>
  );
}
