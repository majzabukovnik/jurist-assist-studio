ALTER TABLE public.compliance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on compliance"
  ON public.compliance
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on compliance"
  ON public.compliance
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);