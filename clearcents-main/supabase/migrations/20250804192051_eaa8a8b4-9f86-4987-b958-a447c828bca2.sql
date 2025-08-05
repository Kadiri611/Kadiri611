-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create homepage_content table for editable content
CREATE TABLE public.homepage_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL UNIQUE,
    title text,
    subtitle text,
    description text,
    button_text text,
    button_color text,
    button_text_color text,
    image_url text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on homepage_content
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for homepage_content
CREATE POLICY "Anyone can view homepage content" 
ON public.homepage_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update homepage content" 
ON public.homepage_content 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert homepage content" 
ON public.homepage_content 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete homepage content" 
ON public.homepage_content 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default homepage content
INSERT INTO public.homepage_content (section_id, title, subtitle, description, button_text, button_color, button_text_color, image_url) VALUES
('hero', 'Maximize 💰 Your Financial Potential', 'All-in-one Financial Analytics Dashboard', '', 'Get Started', '#500CB0', '#FFFFFF', '/lovable-uploads/8a5e2d6b-3701-45cb-8c4a-072de28f0972.png'),
('empower', 'Empower Your Financial Future with us', 'Comprehensive Financial Analytics Dashboard', 'Gain real-time visibility into your financial performance with intuitive dashboards.', '', '', '', '/lovable-uploads/44b36532-c7fa-41dd-8359-e4f1cb631d30.png'),
('track-expenses', 'Track Your all the Expense Easily', '', 'Effortlessly monitor and manage all your expenses with our intuitive tracking system. Stay on top of your finances by easily recording and categorizing expenses, ensuring you have a clear overview of your spending habits.', 'Get Started', '#500CB0', '#FFFFFF', '/lovable-uploads/05e650a3-966d-4ae9-aa26-f123f9802b09.png'),
('send-money', 'Send Money Across the Globe', '', 'Transfer money instantly to anywhere in the world with our secure and reliable global payment system.', '', '', '', ''),
('achieve-excellence', 'Achieve Financial Excellence', '', 'Take control of your financial future with our comprehensive suite of tools designed for success.', '', '', '', ''),
('integrations', 'Integrate With Your Favorite Tools', '', 'Connect with all your favorite financial tools and platforms for a seamless experience.', 'Explore Integrations', '#500CB0', '#FFFFFF', ''),
('final-cta', 'Ready to Run your Business Better with us', '', 'Join thousands of businesses that trust our platform for their financial management needs.', 'Get Started', '#500CB0', '#FFFFFF', '');

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_homepage_content_updated_at
    BEFORE UPDATE ON public.homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();