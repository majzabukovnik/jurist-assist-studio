
CREATE TABLE public.email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_id uuid REFERENCES public.summaries(id) ON DELETE SET NULL,
  to_name text,
  to_email text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'sent', 'failed')),
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on email_queue"
  ON public.email_queue
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on email_queue"
  ON public.email_queue
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update on email_queue"
  ON public.email_queue
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.email_queue;
