"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import Alert from "@mui/material/Alert";
import Box from "@/src/components/mui/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@/src/components/mui/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@/src/components/mui/Stack";
import Typography from "@mui/material/Typography";
import type { WheelDataType } from "react-custom-roulette";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import HeroBackdrop from "@/src/components/layout/HeroBackdrop";
import { pickWeightedIndex } from "@/src/lib/raffleWheelPick";
import type {
  RaffleEntriesPayload,
  RaffleParticipant,
} from "@/src/resources/types";

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
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

const PALETTE = [
  "#134e4a",
  "#0f766e",
  "#115e59",
  "#0d9488",
  "#14b8a6",
  "#2dd4bf",
];

function formatTargetDate(ymd: string, timeZone: string): string {
  const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return ymd;
  const utc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return utc.toLocaleDateString("pt-BR", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatInstagramDisplay(handle: string): string {
  const h = handle.trim();
  if (!h) return "—";
  return h.startsWith("@") ? h : `@${h}`;
}

/** Rótulo só na roleta: nome; sem Instagram entre parênteses. */
function wheelSegmentLabel(p: RaffleParticipant): string {
  const name = p.name.trim();
  if (name) return name;
  const ig = p.instagram.trim().replace(/^@/, "");
  if (ig) return ig;
  return "Participante";
}

export default function RaffleWheelScreen() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [payload, setPayload] = useState<RaffleEntriesPayload | null>(null);
  const [winnerOpen, setWinnerOpen] = useState(false);
  const [winner, setWinner] = useState<RaffleParticipant | null>(null);
  const winningIndexRef = useRef(0);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDetail(null);
    try {
      const res = await fetch("/api/raffle/entries", {
        credentials: "include",
        cache: "no-store",
      });
      const data = (await res.json()) as RaffleEntriesPayload & {
        error?: string;
        detail?: string;
      };
      if (!res.ok) {
        setPayload(null);
        setError(
          data.error === "unauthorized"
            ? "Sessão inválida. Desbloqueie o sorteio pelo Admin."
            : data.error === "sheet_not_accessible"
              ? "Não foi possível ler a planilha."
              : data.error === "missing_columns"
                ? "Cabeçalhos da planilha não reconhecidos."
                : data.error === "empty_sheet"
                  ? "Planilha vazia."
                  : "Não foi possível carregar as inscrições.",
        );
        setDetail(data.detail ?? null);
        return;
      }
      setPayload({
        timeZone: data.timeZone,
        targetYmd: data.targetYmd,
        totalTickets: data.totalTickets,
        participants: data.participants,
      });
    } catch {
      setPayload(null);
      setError("Falha de rede ao carregar inscrições.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const wheelData: WheelDataType[] = useMemo(() => {
    if (!payload?.participants.length) return [];
    return payload.participants.map((p) => ({
      option: wheelSegmentLabel(p),
      optionSize: p.tickets,
    }));
  }, [payload]);

  const weights = useMemo(
    () => payload?.participants.map((p) => p.tickets) ?? [],
    [payload],
  );

  const backgroundColors = useMemo(
    () => wheelData.map((_, i) => PALETTE[i % PALETTE.length]),
    [wheelData],
  );

  const handleSpin = () => {
    if (mustSpin || !payload || weights.length === 0) return;
    const next = pickWeightedIndex(weights);
    winningIndexRef.current = next;
    setPrizeNumber(next);
    setMustSpin(true);
  };

  const handleStopSpinning = useCallback(() => {
    setMustSpin(false);
    const idx = winningIndexRef.current;
    const p = payload;
    const row = p?.participants[idx];
    if (row) {
      setWinner(row);
      setWinnerOpen(true);
    }
  }, [payload]);

  const dateLabel =
    payload &&
    formatTargetDate(payload.targetYmd, payload.timeZone);

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
          suppressHydrationWarning
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
              Cada US$1 depositado no formulário vira 1 ticket na roleta. Só entram
              respostas cujo carimbo de data/hora cai no dia anterior ao de hoje (
              {payload?.timeZone ?? "America/Sao_Paulo"}).
            </Typography>
            {dateLabel ? (
              <Typography
                variant="subtitle2"
                sx={{ color: "primary.light", mt: 1.5, fontWeight: 600 }}
              >
                Sorteando inscrições de: {dateLabel}
              </Typography>
            ) : null}
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
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

          {!loading && !error && payload && payload.totalTickets === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Nenhuma inscrição válida para o dia das respostas:{" "}
              <strong>
                {formatTargetDate(payload.targetYmd, payload.timeZone)}
              </strong>{" "}
              (é sempre o dia <strong>anterior</strong> ao de hoje em{" "}
              {payload.timeZone}). Só contam linhas com carimbo nesse dia, valor
              depositado ≥ US$1 (inteiro) e datas da planilha em formato{" "}
              <strong>DD/MM/AAAA</strong>.
            </Alert>
          ) : null}

          {!loading && payload && wheelData.length > 0 ? (
            <>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", textAlign: "center", mb: 2 }}
              >
                {payload.participants.length} participante(s) ·{" "}
                {payload.totalTickets} ticket(s) no total
              </Typography>
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
                  data={wheelData}
                  backgroundColors={backgroundColors}
                  textColors={["#f8fafc"]}
                  outerBorderColor="rgba(255,255,255,0.2)"
                  outerBorderWidth={8}
                  innerRadius={12}
                  innerBorderColor="rgba(255,255,255,0.35)"
                  innerBorderWidth={4}
                  radiusLineColor="rgba(255,255,255,0.25)"
                  radiusLineWidth={2}
                  fontSize={14}
                  spinDuration={2}
                  onStopSpinning={handleStopSpinning}
                />
              </Box>
            </>
          ) : null}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSpin}
              disabled={mustSpin || loading || !!error || wheelData.length === 0}
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
            {!loading && !error ? (
              <Button
                size="small"
                onClick={() => void loadEntries()}
                sx={{ color: "text.secondary" }}
              >
                Atualizar dados da planilha
              </Button>
            ) : null}
          </Box>
        </motion.div>
      </Container>

      <Dialog
        open={winnerOpen}
        onClose={() => setWinnerOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              border: "1px solid",
              borderColor: "glass.border",
              bgcolor: "rgba(12,12,16,0.98)",
              backdropFilter: "blur(16px)",
            },
          },
        }}
      >
        <DialogTitle sx={{ color: "common.white", fontWeight: 700 }}>
          Sorteado
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "glass.border" }}>
          {winner ? (
            <Stack spacing={2.25}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Nome e sobrenome
                </Typography>
                <Typography sx={{ color: "common.white", fontWeight: 600 }}>
                  {winner.name.trim() || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Instagram
                </Typography>
                <Typography sx={{ color: "common.white", fontWeight: 600 }}>
                  {formatInstagramDisplay(winner.instagram)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  E-mail
                </Typography>
                <Typography
                  sx={{ color: "common.white", fontWeight: 600, wordBreak: "break-word" }}
                >
                  {winner.email.trim() || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Soma das entradas (tickets)
                </Typography>
                <Typography sx={{ color: "primary.light", fontWeight: 700, fontSize: "1.25rem" }}>
                  {winner.tickets}{" "}
                  <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
                    (US$1 = 1 ticket na roleta)
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                  {winner.submissionCount}{" "}
                  {winner.submissionCount === 1
                    ? "linha no formulário nesse dia"
                    : "linhas no formulário nesse dia (valores somados)"}
                </Typography>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setWinnerOpen(false)}
            variant="contained"
            sx={{
              borderRadius: 999,
              fontWeight: 700,
              color: "#0a0a0a",
              bgcolor: "common.white",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
