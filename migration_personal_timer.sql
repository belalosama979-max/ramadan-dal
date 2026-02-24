-- Migration: Personal Countdown Timers
-- Each participant gets their own 2-minute timer within the global question window.
-- Run in Supabase SQL Editor.

-- ============================================================
-- PERSONAL TIMERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.personal_timers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid NOT NULL REFERENCES public.questions(id),
  normalized_name text NOT NULL,
  personal_start_time timestamptz NOT NULL,
  personal_end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(question_id, normalized_name)
);

-- RLS (matches existing app pattern — anon key, no Supabase Auth)
ALTER TABLE public.personal_timers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all" ON public.personal_timers FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON public.personal_timers FOR INSERT WITH CHECK (true);
-- No UPDATE or DELETE needed — timers are immutable once created
