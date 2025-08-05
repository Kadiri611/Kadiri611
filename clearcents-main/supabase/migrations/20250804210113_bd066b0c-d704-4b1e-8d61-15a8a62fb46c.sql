-- Add price field to pricing_content table
ALTER TABLE public.pricing_content 
ADD COLUMN price NUMERIC(10,2) DEFAULT 9.00;