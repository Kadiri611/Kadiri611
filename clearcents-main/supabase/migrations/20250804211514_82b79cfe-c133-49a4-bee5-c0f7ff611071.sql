-- Create branding settings table
CREATE TABLE public.branding_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#500CB0',
  secondary_color TEXT DEFAULT '#FFFFFF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- Policies for branding settings
CREATE POLICY "Anyone can view branding settings" 
ON public.branding_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage branding settings" 
ON public.branding_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_branding_settings_updated_at
BEFORE UPDATE ON public.branding_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default branding settings
INSERT INTO public.branding_settings (business_name, logo_url, primary_color, secondary_color)
VALUES ('Your Business', NULL, '#500CB0', '#FFFFFF');