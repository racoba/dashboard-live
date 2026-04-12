"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useAdminGate } from "@/src/components/AdminGateProvider";

const errorMessages: Record<string, string> = {
  invalid: "Hash incorreto.",
  invalid_hash: "Hash incorreto.",
  not_configured: "Servidor sem NEXT_ADMIN_HASH configurado.",
  network: "Não foi possível conectar. Tente de novo.",
};

export default function AdminUnlockDialog() {
  const { dialogOpen, closeAdminDialog, submitHash } = useAdminGate();
  const [value, setValue] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleClose = () => {
    if (pending) return;
    setErrorKey(null);
    setValue("");
    closeAdminDialog();
  };

  const handleSubmit = async () => {
    setErrorKey(null);
    setPending(true);
    const result = await submitHash(value);
    setPending(false);
    if (!result.ok) {
      setErrorKey(result.error ?? "invalid");
      return;
    }
    setValue("");
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: "1px solid",
            borderColor: "glass.border",
            bgcolor: "rgba(12,12,16,0.96)",
            backdropFilter: "blur(16px)",
          },
        },
      }}
    >
      <DialogTitle sx={{ color: "common.white", fontWeight: 700 }}>
        Acesso administrativo
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <Alert severity="info" sx={{ bgcolor: "rgba(94,234,212,0.12)", color: "primary.light" }}>
          Informe o hash configurado em <code>NEXT_ADMIN_HASH</code> para liberar a área do
          sorteio neste dispositivo.
        </Alert>
        {errorKey ? (
          <Alert severity="error">
            {errorMessages[errorKey] ?? "Não foi possível validar o hash."}
          </Alert>
        ) : null}
        <TextField
          autoFocus
          label="Hash"
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSubmit();
          }}
          fullWidth
          disabled={pending}
          autoComplete="off"
          slotProps={{
            input: {
              sx: { borderRadius: 2 },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={pending} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={() => void handleSubmit()}
          variant="contained"
          disabled={pending || !value.trim()}
          sx={{
            borderRadius: 999,
            fontWeight: 700,
            color: "#0a0a0a",
            bgcolor: "common.white",
            "&:hover": { bgcolor: "grey.200" },
          }}
        >
          {pending ? "Validando…" : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
