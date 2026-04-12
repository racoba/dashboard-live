"use client";

import { useState } from "react";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";

const Wheel = dynamic(
  () =>
    import("react-custom-roulette").then((mod) => mod.Wheel),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          width: 280,
          height: 280,
          borderRadius: "50%",
          border: "1px dashed",
          borderColor: "glass.border",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          fontSize: "0.875rem",
        }}
      >
        Carregando roleta…
      </Box>
    ),
  },
);

const WHEEL_DATA = [
  { option: "Ticket A" },
  { option: "Ticket B" },
  { option: "Ticket C" },
  { option: "Ticket D" },
  { option: "Ticket E" },
  { option: "Ticket F" },
];

export default function RaffleWheelScreen() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpin = () => {
    if (mustSpin) return;
    const next = Math.floor(Math.random() * WHEEL_DATA.length);
    setPrizeNumber(next);
    setMustSpin(true);
  };

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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "common.white",
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
              }}
            >
              Sorteio
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
              Roleta de demonstração — substitua os tickets pelos dados reais da live.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
              "& canvas": { maxWidth: "100%", height: "auto" },
            }}
          >
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={WHEEL_DATA}
              backgroundColors={["#134e4a", "#0f766e", "#115e59", "#0d9488", "#14b8a6", "#2dd4bf"]}
              textColors={["#f8fafc"]}
              outerBorderColor="rgba(255,255,255,0.2)"
              outerBorderWidth={8}
              innerRadius={12}
              innerBorderColor="rgba(255,255,255,0.35)"
              innerBorderWidth={4}
              radiusLineColor="rgba(255,255,255,0.25)"
              radiusLineWidth={2}
              fontSize={15}
              spinDuration={0.85}
              onStopSpinning={() => setMustSpin(false)}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSpin}
              disabled={mustSpin}
              startIcon={<CasinoOutlinedIcon />}
              sx={{
                borderRadius: 999,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                color: "#0a0a0a",
                bgcolor: "common.white",
                "&:hover": { bgcolor: "grey.100" },
                "&.Mui-disabled": {
                  color: "rgba(10,10,10,0.4)",
                  bgcolor: "rgba(255,255,255,0.5)",
                },
              }}
            >
              {mustSpin ? "Girando…" : "Girar roleta"}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
