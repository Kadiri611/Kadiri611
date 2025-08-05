-- Create features_content table for dynamic features page management
CREATE TABLE public.features_content (
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
ALTER TABLE public.features_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to features content" 
ON public.features_content 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage features content
CREATE POLICY "Allow authenticated users to insert features content" 
ON public.features_content 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update features content" 
ON public.features_content 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_features_content_updated_at
BEFORE UPDATE ON public.features_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default features content
INSERT INTO public.features_content (section_id, title, subtitle, description, button_text, background_color) VALUES
('hero', 'Powerful Financial Features', 'Everything you need to manage your finances effectively', 'Discover the comprehensive suite of tools designed to simplify your financial management and boost your productivity.', 'Get Started', '#1a1a1a'),
('smart-budgeting', 'Smart Budgeting', 'Intelligent budget planning and tracking', 'Set realistic budgets and track your spending with our AI-powered insights that help you stay on track.', 'Learn More', '#FFFFFF'),
('expense-tracking', 'Advanced Expense Tracking', 'Real-time expense monitoring', 'Monitor every transaction with detailed categorization and analytics for better financial visibility.', 'Try Now', '#FFFFFF'),
('analytics', 'Financial Analytics', 'Deep insights into your spending patterns', 'Get comprehensive reports and visualizations that help you understand your financial behavior.', 'View Analytics', '#FFFFFF'),
('security', 'Bank-Grade Security', 'Your data is protected with military-grade encryption', 'We use the highest security standards to ensure your financial information stays safe and private.', 'Learn More', '#FFFFFF'),
('integrations', 'Seamless Integrations', 'Connect with your favorite financial tools', 'Integrate with banks, credit cards, and financial platforms for a unified experience.', 'See Integrations', '#FFFFFF');