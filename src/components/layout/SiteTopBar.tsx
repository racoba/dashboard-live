"use client";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminGate } from "@/src/components/AdminGateProvider";
import { getMainNavItems } from "@/src/resources/nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navPillSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  px: { xs: 1, sm: 1.5 },
  py: 0.75,
  borderRadius: 999,
  overflowX: "auto" as const,
  scrollbarWidth: "none" as const,
  "&::-webkit-scrollbar": { display: "none" },
  border: "1px solid",
  borderColor: "glass.border",
  backgroundColor: "glass.surface",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
};

export default function SiteTopBar({
  showAdminButton = false,
}: {
  showAdminButton?: boolean;
}) {
  const pathname = usePathname();
  const { unlocked, openAdminDialog } = useAdminGate();
  const navItems = getMainNavItems(unlocked);

  const nav = (
    <Box component="nav" aria-label="Principal" sx={navPillSx}>
      {navItems.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Button
            key={href}
            component={Link}
            href={href}
            color="inherit"
            size="small"
            sx={{
              flexShrink: 0,
              px: { xs: 1.25, sm: 2 },
              py: 0.75,
              borderRadius: 999,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              color: active ? "common.white" : "text.secondary",
              bgcolor: active ? "glass.highlight" : "transparent",
              "&:hover": {
                bgcolor: "glass.highlight",
                color: "common.white",
              },
            }}
          >
            {label}
          </Button>
        );
      })}
    </Box>
  );

  const logo = (
    <Box
      component={Link}
      href="/"
      aria-label="Início"
      sx={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        flexShrink: 0,
        background:
          "linear-gradient(135deg, rgba(94,234,212,0.95) 0%, rgba(13,148,136,0.9) 100%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.18) inset, 0 8px 28px rgba(94,234,212,0.25)",
      }}
    />
  );

  const adminBtn = (
    <Button
      type="button"
      variant="outlined"
      size="medium"
      onClick={openAdminDialog}
      startIcon={<AdminPanelSettingsOutlinedIcon />}
      sx={{
        borderRadius: 999,
        px: 2.5,
        borderColor: "glass.border",
        color: "common.white",
        bgcolor: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
        "&:hover": {
          borderColor: "primary.light",
          bgcolor: "rgba(94,234,212,0.08)",
        },
      }}
    >
      Admin
    </Button>
  );

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        pt: { xs: 2, sm: 3 },
        pb: 1,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: showAdminButton ? "space-between" : "flex-start",
              gap: 2,
            }}
          >
            {logo}
            {showAdminButton ? adminBtn : null}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>{nav}</Box>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: showAdminButton
              ? "auto 1fr auto"
              : "auto 1fr",
            alignItems: "center",
            gap: 2,
          }}
        >
          {logo}
          <Box sx={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
            <Box sx={{ maxWidth: "100%" }}>{nav}</Box>
          </Box>
          {showAdminButton ? adminBtn : null}
        </Box>
      </Container>
    </Box>
  );
}
