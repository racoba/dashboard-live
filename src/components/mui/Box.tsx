"use client";

import type { ElementType } from "react";
import MuiBox, { type BoxProps as MuiBoxProps } from "@mui/material/Box";

/** Extensões do browser injetam atributos (ex. `bis_skin_checked`) antes da hidratação. */
export default function Box<
  Root extends ElementType = "div",
  AdditionalProps extends object = object,
>(props: MuiBoxProps<Root, AdditionalProps>) {
  return <MuiBox {...props} suppressHydrationWarning />;
}
