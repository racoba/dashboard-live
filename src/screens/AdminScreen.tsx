"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@/src/components/mui/Box";
import Container from "@/src/components/mui/Container";
import Paper from "@/src/components/mui/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";

export default function AdminScreen() {
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
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 5 },
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "glass.border",
              backgroundColor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(16px)",
            }}
          >
            <LockOutlinedIcon
              sx={{ fontSize: 52, color: "primary.light", mb: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "common.white", mb: 1 }}>
              Área administrativa
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
              Use este espaço para fluxos restritos (autenticação, gestão de inscrições,
              exportação de dados). A proteção por login pode ser adicionada aqui quando
              estiver pronta.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
