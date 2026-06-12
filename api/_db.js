// Acceso a Supabase (PostgREST) desde las funciones serverless. Usa la anon
// key: las policies de la tabla matches permiten select/insert/update.
// El prefijo "_" evita que Vercel exponga este fichero como endpoint.

const SB_URL = process.env.SUPABASE_URL || "https://hmjyfdcbmqtoddnprtlq.supabase.co";
const SB_KEY = process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtanlmZGNibXF0b2RkbnBydGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODQ3MjQsImV4cCI6MjA5NjU2MDcyNH0.ZkdAX_lDk1t89mbEUWIznRuiAbVQagp--1pXas2yrso";

async function sb(path, opts = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: opts.method && opts.method !== "GET" ? "return=minimal" : "count=none",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status} en ${path.split("?")[0]}: ${detail.slice(0, 200)}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

module.exports = { sb, SB_URL };
