"use client";

import type { ComponentProps } from "react";
import MuiStack from "@mui/material/Stack";

type StackProps = ComponentProps<typeof MuiStack>;

export default function Stack(props: StackProps) {
  return <MuiStack {...props} suppressHydrationWarning />;
}
