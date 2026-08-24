-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('nrsa-uploads', 'nrsa-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access to uploaded files
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'nrsa-uploads');

-- Create policy for authenticated uploads
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
CREATE POLICY "Authenticated uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'nrsa-uploads');