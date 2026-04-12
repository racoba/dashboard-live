"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdminGate } from "@/src/components/AdminGateProvider";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";
import { RAFFLE_FORM_URL } from "@/src/resources/links";

export default function LandingScreen() {
  const { unlocked } = useAdminGate();
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: "100%" }}
          >
            <Typography
              variant="overline"
              sx={{
                letterSpacing: "0.28em",
                color: "primary.light",
                display: "block",
                mb: 1,
              }}
            >
              Live
            </Typography>
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.15,
                color: "common.white",
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
                textWrap: "balance",
              }}
            >
              Um clique para entrar no sorteio
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 520,
                mx: "auto",
                mt: 2,
                lineHeight: 1.7,
                fontSize: { xs: "1rem", sm: "1.05rem" },
              }}
            >
              Preencha o formulário para garantir sua entrada.{" "}
              <Box component="span" sx={{ color: "common.white", fontWeight: 600 }}>
                1$ = 1 ticket
              </Box>
              . Após ser sorteado, valide as entradas junto com o streamer.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: unlocked ? "row" : "column" },
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Button
                component="a"
                href={RAFFLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                endIcon={<OpenInNewIcon />}
                sx={{
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
                Abrir formulário de inscrição
              </Button>
              {unlocked ? (
                <Button
                  component={Link}
                  href="/sorteio"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.75,
                    px: 3,
                    minWidth: { xs: "100%", sm: "auto" },
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 999,
                    borderColor: "glass.border",
                    color: "common.white",
                    bgcolor: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                    "&:hover": {
                      borderColor: "primary.light",
                      bgcolor: "rgba(94,234,212,0.08)",
                    },
                  }}
                >
                  Ir para o sorteio
                </Button>
              ) : null}
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mt: 2 }}
            >
              O formulário abre em uma nova aba (Google Forms)
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
