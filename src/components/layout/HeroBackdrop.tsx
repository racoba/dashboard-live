"use client";

import Box from "@mui/material/Box";
import { motion } from "framer-motion";

export default function HeroBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "-18%",
          left: "10%",
          width: "min(520px, 90vw)",
          height: "min(520px, 90vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(94,234,212,0.45), transparent 62%)",
          filter: "blur(48px)",
        }}
        animate={{ opacity: [0.5, 0.85, 0.55], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-12%",
          right: "4%",
          width: "min(480px, 85vw)",
          height: "min(480px, 85vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 70% 60%, rgba(167,243,208,0.35), rgba(255,255,255,0.12), transparent 65%)",
          filter: "blur(56px)",
        }}
        animate={{ opacity: [0.35, 0.7, 0.4], scale: [1.02, 1, 1.05] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "42%",
          left: "50%",
          width: "1px",
          height: "38%",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />
    </Box>
  );
}
