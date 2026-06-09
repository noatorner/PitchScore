// KANCHA — Supabase client
// Requires the Supabase CDN to be loaded first:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL     = "https://hmjyfdcbmqtoddnprtlq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtanlmZGNibXF0b2RkbnBydGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODQ3MjQsImV4cCI6MjA5NjU2MDcyNH0.ZkdAX_lDk1t89mbEUWIznRuiAbVQagp--1pXas2yrso";

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
