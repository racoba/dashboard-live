"use client";

import type { ReactNode } from "react";
import Box from "@/src/components/mui/Box";
import { AdminGateProvider } from "@/src/components/AdminGateProvider";
import AdminUnlockDialog from "@/src/components/layout/AdminUnlockDialog";
import SiteTopBar from "@/src/components/layout/SiteTopBar";

interface SiteChromeProps {
  children: ReactNode;
  showAdminButton?: boolean;
}

export default function SiteChrome({
  children,
  showAdminButton = false,
}: SiteChromeProps) {
  return (
    <AdminGateProvider>
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <SiteTopBar showAdminButton={showAdminButton} />
        <Box
          component="div"
          sx={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          {children}
        </Box>
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "glass.border",
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          Dashboard Live · Sorteios e inscrições
        </Box>
        {showAdminButton ? <AdminUnlockDialog /> : null}
      </Box>
    </AdminGateProvider>
  );
}
