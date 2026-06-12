-- ============================================================
-- KANCHA — Tabla de partidos del Mundial 2026 (fixture dinámico)
-- Ejecutar en Supabase → SQL Editor. No es destructivo (IF NOT EXISTS /
-- ON CONFLICT DO NOTHING).
-- ============================================================

CREATE TABLE IF NOT EXISTS matches (
  id text PRIMARY KEY,
  home text, away text,
  kickoff_utc timestamptz,
  venue text, group_name text,
  status text DEFAULT 'PROXIMO',
  score text,
  api_match_id text
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches are public" ON matches FOR SELECT USING (true);
CREATE POLICY "service can update matches" ON matches FOR UPDATE USING (true);
-- /api/sync-fixture también inserta partidos nuevos que descubre en la API
CREATE POLICY "service can insert matches" ON matches FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------
-- Semilla: jornadas con horario UTC oficial verificado (11–15 JUN).
-- El resto de los 104 partidos se importan automáticamente desde la API
-- de fútbol (free-api-live-football-data) vía /api/sync-fixture y el cron
-- /api/cron-sync conforme avanza el torneo: la API es la fuente de verdad
-- de horarios, estados y marcadores.
-- ------------------------------------------------------------
INSERT INTO matches (id, home, away, kickoff_utc, venue, group_name, status, score) VALUES
  ('m1',  'MEX', 'RSA', '2026-06-11T19:00:00Z', 'Mexico City Stadium',  'A', 'FINALIZADO', '2-0'),
  ('m2',  'KOR', 'CZE', '2026-06-12T02:00:00Z', 'Estadio Guadalajara',  'B', 'PROXIMO', NULL),
  ('m3',  'CAN', 'BIH', '2026-06-12T19:00:00Z', 'Toronto Stadium',      'C', 'PROXIMO', NULL),
  ('m4',  'USA', 'PAR', '2026-06-13T01:00:00Z', 'Los Angeles Stadium',  'D', 'PROXIMO', NULL),
  ('m5',  'HAI', 'SCO', '2026-06-14T01:00:00Z', 'Seattle Stadium',      'E', 'PROXIMO', NULL),
  ('m6',  'BRA', 'POR', '2026-06-13T22:00:00Z', 'Estadio Monterrey',    'F', 'PROXIMO', NULL),
  ('m7',  'ARG', 'JPN', '2026-06-13T19:00:00Z', 'Vancouver Stadium',    'G', 'PROXIMO', NULL),
  ('m8',  'ESP', 'NOR', '2026-06-14T19:00:00Z', 'Atlanta Stadium',      'H', 'PROXIMO', NULL),
  ('m9',  'FRA', 'CRC', '2026-06-14T22:00:00Z', 'Boston Stadium',       'A', 'PROXIMO', NULL),
  ('m10', 'GER', 'AUS', '2026-06-15T01:00:00Z', 'Dallas Stadium',       'B', 'PROXIMO', NULL),
  ('m11', 'ITA', 'PAN', '2026-06-15T19:00:00Z', 'Kansas City Stadium',  'C', 'PROXIMO', NULL),
  ('m12', 'ENG', 'SUI', '2026-06-15T22:00:00Z', 'Houston Stadium',      'D', 'PROXIMO', NULL)
ON CONFLICT (id) DO NOTHING;
