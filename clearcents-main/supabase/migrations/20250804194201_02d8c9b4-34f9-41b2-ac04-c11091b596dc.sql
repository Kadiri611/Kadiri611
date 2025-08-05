-- Add text color fields to homepage_content
ALTER TABLE public.homepage_content 
ADD COLUMN title_color text DEFAULT '#000000',
ADD COLUMN subtitle_color text DEFAULT '#000000',
ADD COLUMN description_color text DEFAULT '#666666';

-- Create pages table for dynamic page management
CREATE TABLE public.pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    content text,
    meta_description text,
    is_published boolean DEFAULT true,
    created_by uuid REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Policies for pages
CREATE POLICY "Anyone can view published pages" 
ON public.pages 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can view all pages" 
ON public.pages 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create pages" 
ON public.pages 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pages" 
ON public.pages 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pages" 
ON public.pages 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updating updated_at timestamp on pages
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing homepage content with default text colors
UPDATE public.homepage_content 
SET 
    title_color = '#000000',
    subtitle_color = '#000000', 
    description_color = '#666666'
WHERE title_color IS NULL;