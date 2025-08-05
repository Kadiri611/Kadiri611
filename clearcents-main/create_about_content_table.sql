-- Create about_content table manually
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.about_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    button_text TEXT,
    button_color TEXT,
    button_text_color TEXT,
    title_color TEXT,
    subtitle_color TEXT,
    description_color TEXT,
    background_color TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for about_content
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read about_content
CREATE POLICY "Allow authenticated users to read about_content" ON public.about_content
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admin users to insert/update/delete about_content
CREATE POLICY "Allow admin users to manage about_content" ON public.about_content
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_about_content_section_id ON public.about_content(section_id);

-- Insert some sample data for testing
INSERT INTO public.about_content (section_id, title, subtitle, description, button_text, button_color, title_color, subtitle_color, description_color, background_color) VALUES
('hero', 'Why we built FinSuite', 'Making budgeting simple and stress-free for everyone.', 'We believe everyone deserves to feel confident about their money.', 'Start Your Journey', '#500CB0', '#ffffff', '#ffffff', '#ffffff', 'linear-gradient(to bottom right, #2c3e50, #34495e)'),
('story', 'Our Story', NULL, 'We started FinSuite because we were frustrated with existing budgeting tools. They were either too complicated, too expensive, or missing key features that real people actually need.', NULL, '#500CB0', '#000000', '#000000', '#666666', '#ffffff'),
('values', 'Our Values', 'These principles guide everything we do at FinSuite.', NULL, NULL, '#500CB0', '#000000', '#000000', '#666666', '#f8fafc'),
('stats', NULL, NULL, NULL, NULL, '#500CB0', '#000000', '#000000', '#666666', '#ffffff'),
('team', 'Built by a small, passionate team', 'We\'re a tight-knit group of designers, developers, and financial enthusiasts who believe in making budgeting better for everyone.', NULL, 'View Open Positions', '#500CB0', '#000000', '#000000', '#666666', '#f8fafc'),
('cta', 'Join us and take control of your money today', 'Become part of a community that believes in financial clarity and empowerment.', NULL, 'Start Your Journey', '#ffffff', '#ffffff', '#ffffff', '#ffffff', 'linear-gradient(to bottom right, #4c1d95, #7c3aed)')
ON CONFLICT (section_id) DO NOTHING; 