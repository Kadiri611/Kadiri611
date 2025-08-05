-- Create pricing_content table for dynamic pricing page management
CREATE TABLE public.pricing_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_color TEXT DEFAULT '#500CB0',
  button_text_color TEXT DEFAULT '#FFFFFF',
  title_color TEXT DEFAULT '#000000',
  subtitle_color TEXT DEFAULT '#666666',
  description_color TEXT DEFAULT '#666666',
  background_color TEXT DEFAULT '#FFFFFF',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pricing_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to pricing content" 
ON public.pricing_content 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage pricing content
CREATE POLICY "Allow authenticated users to insert pricing content" 
ON public.pricing_content 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update pricing content" 
ON public.pricing_content 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pricing_content_updated_at
BEFORE UPDATE ON public.pricing_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing content
INSERT INTO public.pricing_content (section_id, title, subtitle, description, button_text, background_color) VALUES
('hero', 'Choose Your Plan', 'Simple, transparent pricing for every budget', 'Start with our free plan and upgrade as you grow. No hidden fees, no surprises.', 'Start Free Trial', '#1a1a1a'),
('starter', 'Starter', 'Perfect for individuals', 'Everything you need to get started with financial management.', 'Start Free', '#FFFFFF'),
('pro', 'Pro', 'Best for small teams', 'Advanced features for growing businesses and teams.', 'Upgrade to Pro', '#FFFFFF'),
('enterprise', 'Enterprise', 'For large organizations', 'Custom solutions with dedicated support and advanced security.', 'Contact Sales', '#FFFFFF');