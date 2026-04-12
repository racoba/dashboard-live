import type { MainNavItem } from "@/src/resources/types";

export const MAIN_NAV_PUBLIC = [
  { href: "/", label: "Inscrição" },
  { href: "/historico", label: "Histórico de Sorteios" },
] as const;

export const MAIN_NAV_SORTEIO = {
  href: "/sorteio",
  label: "Sorteio",
} as const;

export function getMainNavItems(showSorteio: boolean): MainNavItem[] {
  const items: MainNavItem[] = MAIN_NAV_PUBLIC.map((i) => ({ ...i }));
  if (showSorteio) {
    items.push({ ...MAIN_NAV_SORTEIO });
  }
  return items;
}
