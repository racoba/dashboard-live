"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@/src/components/mui/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@/src/components/mui/Container";
import Paper from "@/src/components/mui/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";
import type { HistoryPayload } from "@/src/resources/types";

function normalizeHeaderKey(h: string): string {
  return h
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

function headerIsHidden(h: string): boolean {
  const k = normalizeHeaderKey(h);
  return (
    k.includes("instagram") ||
    k.includes("insta") ||
    k.includes("e-mail") ||
    k === "email" ||
    k.includes("email") ||
    (k.includes("mail") && k.includes("endereco"))
  );
}

function headerIsSkin(h: string): boolean {
  const k = normalizeHeaderKey(h);
  return k === "skin" || k.includes("skin sorteada") || (k.includes("skin") && k.includes("sorte"));
}

export default function RaffleHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HistoryPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/raffle/history-rows", { cache: "no-store" });
      const json = (await res.json()) as HistoryPayload & {
        error?: string;
        detail?: string;
      };
      if (!res.ok) {
        setData(null);
        setError(
          json.error === "sheet_not_accessible"
            ? "Não foi possível carregar o histórico neste momento. Tente mais tarde."
            : json.error === "invalid_history_url"
              ? "O histórico está temporariamente indisponível."
              : "Não foi possível carregar o histórico.",
        );
        return;
      }
      setData({ headers: json.headers, rows: json.rows });
    } catch {
      setData(null);
      setError("Falha de rede ao carregar o histórico.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rowsNewestFirst = useMemo(() => {
    if (!data?.rows.length) return [];
    return [...data.rows].reverse();
  }, [data?.rows]);

  const visible = useMemo(() => {
    const headers = data?.headers ?? [];
    const rows = rowsNewestFirst;

    const keepIdx: number[] = [];
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i] ?? "";
      if (!headerIsHidden(h)) keepIdx.push(i);
    }

    const visibleHeaders = keepIdx.map((i) => headers[i]?.trim() || `Coluna ${i + 1}`);
    const visibleRows = rows.map((r) => keepIdx.map((i) => (r[i]?.trim() ?? "")));

    const hasSkin = visibleHeaders.some((h) => headerIsSkin(h));
    if (!hasSkin) {
      visibleHeaders.push("Skin");
      for (const r of visibleRows) r.push("");
    }

    return { headers: visibleHeaders, rows: visibleRows };
  }, [data?.headers, rowsNewestFirst]);

  const colCount = Math.max(
    visible.headers.length ?? 0,
    ...visible.rows.map((r) => r.length),
    1,
  );

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
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "flex-start" },
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "common.white",
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                }}
              >
                Histórico de sorteios
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
                Consulta os resultados dos sorteios. Os mais recentes aparecem primeiro.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void load()}
              disabled={loading}
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                borderRadius: 999,
                borderColor: "glass.border",
                color: "common.white",
                flexShrink: 0,
              }}
            >
              Atualizar
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress color="inherit" size={40} />
            </Box>
          ) : null}

          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          {!loading && !error && data && data.rows.length === 0 ? (
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
                Ainda não há registros
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Quando houver sorteios concluídos, os resultados serão listados aqui.
              </Typography>
            </Paper>
          ) : null}

          {!loading && !error && data && data.rows.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "glass.border",
                backgroundColor: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
                maxHeight: { xs: "60vh", md: "min(70vh, 640px)" },
              }}
            >
              <Table stickyHeader size="small" sx={{ minWidth: 640 }}>
                <TableHead>
                  <TableRow>
                    {Array.from({ length: colCount }, (_, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.35)",
                          color: "primary.light",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {visible.headers[i]?.trim() || `Coluna ${i + 1}`}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visible.rows.map((row, ri) => (
                    <TableRow key={ri} hover sx={{ "& td": { color: "grey.100" } }}>
                      {Array.from({ length: colCount }, (_, ci) => (
                        <TableCell
                          key={ci}
                          sx={{
                            borderColor: "glass.border",
                            maxWidth: 280,
                            wordBreak: "break-word",
                          }}
                        >
                          {row[ci]?.trim() ?? ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </motion.div>
      </Container>
    </Box>
  );
}
