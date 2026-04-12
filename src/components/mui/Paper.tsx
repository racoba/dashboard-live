"use client";

import type { ComponentProps } from "react";
import MuiPaper from "@mui/material/Paper";

type PaperProps = ComponentProps<typeof MuiPaper>;

export default function Paper(props: PaperProps) {
  return <MuiPaper {...props} suppressHydrationWarning />;
}
