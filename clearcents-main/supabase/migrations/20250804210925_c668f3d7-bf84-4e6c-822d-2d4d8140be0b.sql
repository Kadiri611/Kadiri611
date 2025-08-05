-- Add missing background_color column to homepage_content table
ALTER TABLE public.homepage_content 
ADD COLUMN background_color text DEFAULT '#FFFFFF';