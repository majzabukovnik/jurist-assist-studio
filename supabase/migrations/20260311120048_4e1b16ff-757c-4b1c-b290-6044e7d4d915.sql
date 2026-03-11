CREATE TABLE public.compliance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  case_id text,
  povzetek_primera text,
  pravna_podrocja text[],
  panoge text[],
  konflikt_interesov_level text DEFAULT 'green',
  konflikt_interesov_label text,
  aml_kyc_level text DEFAULT 'green',
  aml_kyc_label text,
  kompleksnost integer DEFAULT 0,
  kompleksnost_label text,
  roki jsonb[],
  odvetniki jsonb[],
  priporocilo text
);