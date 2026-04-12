"use client";

import Box from "@/src/components/mui/Box";
import Container from "@/src/components/mui/Container";
import IconButton from "@mui/material/IconButton";
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";
import { RAFFLE_ENTRY_URL } from "@/src/resources/links";

const TWITCH_URL = "https://www.twitch.tv/racoba" as const;
const INSTAGRAM_URL = "https://www.instagram.com/brunoracoba/" as const;

function TwitchIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11.571 4.714h1.715v5.143H11.57V4.714zm4.715 0H18v5.143h-1.714V4.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0H6zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714v9.429z"
      />
    </SvgIcon>
  );
}

function InstagramIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"
      />
    </SvgIcon>
  );
}

const socialIconSx = {
  color: "common.white",
  border: "1px solid",
  borderColor: "glass.border",
  bgcolor: "rgba(255,255,255,0.06)",
  "&:hover": {
    bgcolor: "rgba(94,234,212,0.12)",
    borderColor: "primary.light",
    color: "primary.light",
  },
} as const;

export default function LandingScreen() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      <HeroBackdrop />
      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, flex: 1, display: "flex" }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: { xs: 3, sm: 4 },
            minHeight: { xs: "auto", md: "min(70vh, 640px)" },
          }}
        >
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: "100%" }}
          >
            <Typography
              variant="overline"
              sx={{
                letterSpacing: "0.22em",
                color: "primary.light",
                display: "block",
                mb: 1,
              }}
            >
              Counter-Strike · Skins · Live
            </Typography>
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.15,
                color: "common.white",
                fontSize: { xs: "1.85rem", sm: "2.5rem", md: "3rem" },
                textWrap: "balance",
              }}
            >
              SORTEIO DE SKINS TODOS OS DIAS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 560,
                mx: "auto",
                mt: 2,
                lineHeight: 1.75,
                fontSize: { xs: "1rem", sm: "1.05rem" },
              }}
            >
              Acompanhe streams de CS e conteúdos de aposta.
              Use o cupom abaixo no CSGO.NET para participar de sorteios diários e concorrer a uma skin todos os dias.
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                Cupom
              </Typography>
              <Box
                component="span"
                sx={{
                  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  letterSpacing: "0.2em",
                  color: "#0a0a0a",
                  bgcolor: "primary.light",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "primary.main",
                  boxShadow: "0 0 0 1px rgba(94,234,212,0.35)",
                }}
              >
                RACOBA
              </Box>
            </Box>
          </motion.div>

          <Box sx={{ width: "100%", maxWidth: 560, mx: "auto", textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mt: 2,
                lineHeight: 1.75,
                fontSize: { xs: "1rem", sm: "1.05rem" },
              }}
            >
              Para cadastrar sua entrada clique no botão abaixo. A cada US$1 depositado, você recebe 1 ticket para
              o sorteio.
            </Typography>
            <Button
              component="a"
              href={RAFFLE_ENTRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              endIcon={<OpenInNewIcon />}
              sx={{
                mt: 2.5,
                py: 1.75,
                px: 4,
                minWidth: { xs: "100%", sm: "auto" },
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: 999,
                color: "#0a0a0a",
                bgcolor: "common.white",
                boxShadow: "0 16px 48px rgba(255,255,255,0.22)",
                "&:hover": {
                  bgcolor: "grey.100",
                  boxShadow: "0 20px 56px rgba(255,255,255,0.28)",
                },
              }}
            >
              Cadastrar entrada
            </Button>
          </Box>

          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <IconButton
                component="a"
                href={TWITCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Canal na Twitch — racoba"
                size="large"
                sx={{ ...socialIconSx, color: "#9146FF" }}
              >
                <TwitchIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                component="a"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram — brunoracoba"
                size="large"
                sx={socialIconSx}
              >
                <InstagramIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1.5 }}>
              twitch.tv/racoba · @brunoracoba
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
