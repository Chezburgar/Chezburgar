// Supabase project credentials — match the original Chezburgar backend so
// suggestions and custom games sync with the existing data.
export const projectId = "gzwjdrswzobhfzouaxyb";
export const publicAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6d2pkcnN3em9iaGZ6b3VheHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNjIxNzQsImV4cCI6MjA5NDczODE3NH0.qNP1bKNAcPTB3P9teS476jM_2u21OQmJdqcGYIimiVE";

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-4bc37c37`;

const authHeaders = (extra: Record<string, string> = {}) => ({
  Authorization: `Bearer ${publicAnonKey}`,
  ...extra,
});

export type Suggestion = {
  id: string;
  gameName: string;
  gameUrl: string;
  submittedAt: string;
};

export type CustomGame = {
  id: string;
  name: string;
  url: string;
  color: string;
  icon?: string;
};

export async function listSuggestions(): Promise<Suggestion[]> {
  try {
    const res = await fetch(`${BASE}/suggestions`, { headers: authHeaders() });
    const data = await res.json();
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch (err) {
    console.error("listSuggestions failed:", err);
    return [];
  }
}

export async function submitSuggestion(gameName: string, gameUrl: string) {
  const res = await fetch(`${BASE}/suggestions`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ gameName: gameName.trim(), gameUrl: gameUrl.trim() }),
  });
  return res.ok;
}

export async function deleteSuggestion(id: string) {
  const res = await fetch(`${BASE}/suggestions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.ok;
}

export async function listCustomGames(): Promise<CustomGame[]> {
  try {
    const res = await fetch(`${BASE}/games`, { headers: authHeaders() });
    const data = await res.json();
    return Array.isArray(data.games) ? data.games : [];
  } catch (err) {
    console.error("listCustomGames failed:", err);
    return [];
  }
}

export async function saveCustomGame(game: Omit<CustomGame, "id"> & { id?: string }) {
  const isUpdate = !!game.id;
  const res = await fetch(`${BASE}/games${isUpdate ? `/${game.id}` : ""}`, {
    method: isUpdate ? "PUT" : "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(game),
  });
  return res.ok;
}

export async function deleteCustomGame(id: string) {
  const res = await fetch(`${BASE}/games/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.ok;
}
