"use client";

import type { ComponentProps } from "react";
import MuiContainer from "@mui/material/Container";

type ContainerProps = ComponentProps<typeof MuiContainer>;

export default function Container(props: ContainerProps) {
  return <MuiContainer {...props} suppressHydrationWarning />;
}
