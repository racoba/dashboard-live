"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";
import { RAFFLE_HISTORY_URL } from "@/src/resources/links";

type HistoryPayload = {
  headers: string[];
  rows: string[][];
};

export default function RaffleHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [data, setData] = useState<HistoryPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDetail(null);
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
            ? "Não foi possível ler a planilha de histórico."
            : json.error === "invalid_history_url"
              ? "URL de histórico inválida."
              : "Não foi possível carregar o histórico.",
        );
        setDetail(json.detail ?? null);
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

  const colCount = Math.max(
    data?.headers.length ?? 0,
    ...rowsNewestFirst.map((r) => r.length),
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
                Dados da aba <strong>historico</strong> da planilha ligada em{" "}
                <code style={{ fontSize: "0.85em" }}>RAFFLE_HISTORY_URL</code>. Ordem:
                mais recente primeiro.
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1 }}>
                <a
                  href={RAFFLE_HISTORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  Abrir planilha no Google Sheets
                </a>
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
              {detail ? (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  {detail}
                </Typography>
              ) : null}
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
                Nenhuma linha na aba historico
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Quando um sorteio for gravado na planilha, as entradas aparecerão aqui.
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
                        {data.headers[i]?.trim() || `Coluna ${i + 1}`}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsNewestFirst.map((row, ri) => (
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
