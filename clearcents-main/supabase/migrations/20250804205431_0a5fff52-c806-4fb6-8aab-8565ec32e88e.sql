-- Create FAQs table for managing frequently asked questions
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and admin write access
CREATE POLICY "Anyone can view active FAQs" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage FAQs" 
ON public.faqs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the existing FAQs from the pricing page
INSERT INTO public.faqs (question, answer, display_order, is_active) VALUES
('Is there a free trial?', 'Yes! You can try FinSuite free for 14 days. No credit card required to start.', 1, true),
('Can I cancel anytime?', 'Absolutely. Cancel your subscription anytime with just one click. No questions asked.', 2, true),
('Do you offer refunds?', 'Yes, we offer a 30-day money-back guarantee if you''re not completely satisfied.', 3, true),
('Are there any hidden fees?', 'Never. What you see is what you pay. No setup fees, no transaction fees, no surprises.', 4, true);