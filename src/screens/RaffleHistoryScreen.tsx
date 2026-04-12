"use client";

import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";

export default function RaffleHistoryScreen() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        py: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      <HeroBackdrop />
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "common.white",
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2.25rem" },
            }}
          >
            Histórico de sorteios
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
            Consulte edições anteriores e resultados oficiais.
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "glass.border",
              backgroundColor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(16px)",
            }}
          >
            <HistoryToggleOffOutlinedIcon
              sx={{ fontSize: 48, color: "primary.light", mb: 2, opacity: 0.9 }}
            />
            <Typography variant="h6" sx={{ color: "common.white", mb: 1 }}>
              Nenhum histórico ainda
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Quando os sorteios forem registrados, eles aparecerão aqui.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
