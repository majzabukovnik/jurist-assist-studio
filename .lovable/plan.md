

# Plan: Pošiljanje emaila prek Outlook SMTP

## Pregled

Implementacija pošiljanja emaila ob kliku "Pošlji" prek Outlook SMTP strežnika z uporabo Supabase Edge Function.

## Koraki

### 1. Dodaj SMTP secrets v Supabase
Dodaj 4 secrete:
- `SMTP_HOST` = `smtp.office365.com`
- `SMTP_PORT` = `587`
- `SMTP_USER` = `hekaton.test@outlook.com`
- `SMTP_PASS` = `AI-hekaton`

### 2. Ustvari Edge Function `send-email`
Datoteka: `supabase/functions/send-email/index.ts`
- Uporabi `denomailer` (Deno SMTP knjižnica) za pošiljanje prek Outlook SMTP
- Sprejme JSON body: `to`, `toName`, `subject`, `body` (HTML email telo)
- CORS headers za frontend klice
- Prebere SMTP credentials iz environment secrets

### 3. Posodobi `supabase/config.toml`
Dodaj:
```toml
[functions.send-email]
verify_jwt = false
```

### 4. Posodobi `EmailPanel.tsx`
- Ob kliku "Pošlji":
  - Sestavi HTML email iz vseh urejenih polj (pozdrav, uvod, opis, vprašanja, koraki, zaključek, podpis)
  - Pokliče `supabase.functions.invoke("send-email", { body: ... })`
  - Loading stanje na gumbu med pošiljanjem
  - Toast obvestilo ob uspehu/napaki

## Diagram

```text
EmailPanel (klik Pošlji)
    │ supabase.functions.invoke("send-email")
    ▼
Edge Function "send-email"
    │ denomailer → smtp.office365.com:587
    ▼
Outlook dostavi email prejemniku
```

