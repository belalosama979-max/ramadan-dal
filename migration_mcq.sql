-- Add type and options columns to questions table

-- 1. Add 'type' column with default 'text'
alter table public.questions 
add column if not exists type text default 'text';

-- 2. Add 'options' column (nullable, stored as JSONB)
alter table public.questions 
add column if not exists options jsonb;

-- 3. Add check constraint to ensure options is valid for MCQ (Optional, but good practice if supported)
-- We'll handle strict validation in the application layer as per requirements, 
-- but we can ensure options is null if type is text.
-- alter table public.questions add constraint options_check check (
--   (type = 'text' and options is null) or 
--   (type = 'multiple_choice' and options is not null)
-- );
