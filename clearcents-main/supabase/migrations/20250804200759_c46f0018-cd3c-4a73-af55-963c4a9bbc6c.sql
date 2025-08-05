-- Create footer_links table for managing footer navigation and social media
CREATE TABLE public.footer_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    link_type text NOT NULL CHECK (link_type IN ('navigation', 'social')),
    title text NOT NULL,
    url text NOT NULL,
    icon_name text, -- For social media icons
    display_order integer NOT NULL DEFAULT 0,
    section_group text, -- For grouping navigation links (Company, Product, etc.)
    is_active boolean DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active footer links" 
ON public.footer_links 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage footer links" 
ON public.footer_links 
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_footer_links_updated_at
    BEFORE UPDATE ON public.footer_links
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default footer links
INSERT INTO public.footer_links (link_type, title, url, section_group, display_order) VALUES
-- Company section
('navigation', 'Home', '/', 'Company', 1),
('navigation', 'About us', '/about', 'Company', 2),
('navigation', 'Affiliate Program', '#', 'Company', 3),
('navigation', 'Careers', '#', 'Company', 4),

-- Product section
('navigation', 'Overview', '#', 'Product', 1),
('navigation', 'Features', '/features', 'Product', 2),
('navigation', 'Integrations', '#', 'Product', 3),
('navigation', 'Pricing', '/pricing', 'Product', 4),

-- Resources section
('navigation', 'Blog', '#', 'Resources', 1),
('navigation', 'Podcast', '#', 'Resources', 2),
('navigation', 'Webinars', '#', 'Resources', 3),
('navigation', 'Press', '#', 'Resources', 4),

-- Support section
('navigation', 'Request a Demo', '#', 'Support', 1),
('navigation', 'Contact Us', '/contact', 'Support', 2),
('navigation', 'Report a Bug', '#', 'Support', 3),

-- Social media links
('social', 'Facebook', 'https://facebook.com', '', 1),
('social', 'Instagram', 'https://instagram.com', '', 2),
('social', 'Twitter', 'https://twitter.com', '', 3),
('social', 'LinkedIn', 'https://linkedin.com', '', 4);