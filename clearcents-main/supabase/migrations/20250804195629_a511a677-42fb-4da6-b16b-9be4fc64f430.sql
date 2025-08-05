-- Create a storage bucket for content images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-images', 'content-images', true);

-- Create policies for content images bucket
CREATE POLICY "Anyone can view content images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'content-images');

CREATE POLICY "Admins can upload content images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));