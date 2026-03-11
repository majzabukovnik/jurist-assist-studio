
ALTER TABLE public.email_queue DROP CONSTRAINT email_queue_status_check;
ALTER TABLE public.email_queue ADD CONSTRAINT email_queue_status_check CHECK (status IN ('pending', 'in_progress', 'sent', 'failed', 'accepted', 'rejected'));
