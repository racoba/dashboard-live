"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdminGateContextValue } from "@/src/resources/types";

const AdminGateContext = createContext<AdminGateContextValue | null>(null);

interface AdminGateProviderProps {
  children: ReactNode;
}

export function AdminGateProvider({ children }: AdminGateProviderProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/status", { cache: "no-store" });
      const data = (await res.json()) as { unlocked?: boolean };
      setUnlocked(!!data.unlocked);
    } catch {
      setUnlocked(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submitHash = useCallback(async (hash: string) => {
    try {
      const res = await fetch("/api/admin/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setUnlocked(true);
        setDialogOpen(false);
        return { ok: true as const };
      }
      if (res.status === 503) {
        return { ok: false as const, error: "not_configured" };
      }
      return { ok: false as const, error: data.error ?? "invalid" };
    } catch {
      return { ok: false as const, error: "network" };
    }
  }, []);

  const value = useMemo<AdminGateContextValue>(
    () => ({
      unlocked,
      loading,
      dialogOpen,
      openAdminDialog: () => setDialogOpen(true),
      closeAdminDialog: () => setDialogOpen(false),
      refresh,
      submitHash,
    }),
    [unlocked, loading, dialogOpen, refresh, submitHash],
  );

  return (
    <AdminGateContext.Provider value={value}>{children}</AdminGateContext.Provider>
  );
}

export function useAdminGate() {
  const ctx = useContext(AdminGateContext);
  if (!ctx) {
    throw new Error("useAdminGate must be used within AdminGateProvider");
  }
  return ctx;
}
