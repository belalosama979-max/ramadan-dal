-- Migration: Dynamic Personal Timers
-- Adds personal_duration_seconds to Questions and response_time_seconds to Submissions.
-- Run in Supabase SQL Editor.

-- 1. Update questions table
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS personal_duration_seconds integer DEFAULT 120;

-- 2. Update submissions table
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS response_time_seconds integer;
