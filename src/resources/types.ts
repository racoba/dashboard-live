export type MainNavItem = { href: string; label: string };

export type RaffleParticipant = {
  key: string;
  label: string;
  name: string;
  instagram: string;
  email: string;
  /** Linhas do formulário agregadas neste participante. */
  submissionCount: number;
  /** Soma dos tickets (US$ inteiros depositados). */
  tickets: number;
};

export type RaffleSheetResult =
  | {
      ok: true;
      timeZone: string;
      targetYmd: string;
      participants: RaffleParticipant[];
      totalTickets: number;
    }
  | { ok: false; error: string; detail?: string };

export type RaffleHistoryTableResult =
  | { ok: true; headers: string[]; rows: string[][] }
  | { ok: false; error: string; detail?: string };

export type HistoryPayload = {
  headers: string[];
  rows: string[][];
};

/** Corpo JSON de sucesso de `/api/raffle/entries` e estado local da roleta. */
export type RaffleEntriesPayload = {
  timeZone: string;
  targetYmd: string;
  totalTickets: number;
  participants: RaffleParticipant[];
};

export type AdminGateContextValue = {
  unlocked: boolean;
  loading: boolean;
  dialogOpen: boolean;
  openAdminDialog: () => void;
  closeAdminDialog: () => void;
  refresh: () => Promise<void>;
  submitHash: (hash: string) => Promise<{ ok: boolean; error?: string }>;
};
