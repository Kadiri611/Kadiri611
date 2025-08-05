-- Create about_content table
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

-- Create contact_content table
CREATE TABLE IF NOT EXISTS public.contact_content (
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

-- Add RLS policies for contact_content
ALTER TABLE public.contact_content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read contact_content
CREATE POLICY "Allow authenticated users to read contact_content" ON public.contact_content
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admin users to insert/update/delete contact_content
CREATE POLICY "Allow admin users to manage contact_content" ON public.contact_content
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_about_content_section_id ON public.about_content(section_id);
CREATE INDEX IF NOT EXISTS idx_contact_content_section_id ON public.contact_content(section_id);