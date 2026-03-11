

# Čakalna vrsta in zgodovina mailov

## Kaj bomo zgradili

Sidebar ali tab sistem na levi strani (zraven EmailPanel), ki prikazuje:
1. **Čakalna vrsta** — maili, ki čakajo na obdelavo s strani odvetnika (status: `čaka`, `v obdelavi`)
2. **Poslani** — maili, ki so bili že poslani (status: `poslano`)
3. Seznam mailov s statusom, prejemnikom, zadevo in časom

## Obseg sprememb

### 1. Nova tabela `email_queue` v Supabase
```sql
- id (uuid, PK)
- summary_id (uuid, FK -> summaries.id, nullable)
- to_name (text)
- to_email (text)
- subject (text)
- status (text: 'pending' | 'in_progress' | 'sent' | 'failed')
- sent_at (timestamptz, nullable)
- created_at (timestamptz, default now())
```
RLS: public SELECT (kot ostale tabele). Realtime omogočen.

### 2. Posodobitev Edge Function `send-email`
Ko se email uspešno pošlje, se v `email_queue` vstavi zapis s statusom `sent`. Pri napaki: `failed`.

### 3. Nova komponenta `EmailQueue.tsx`
- Seznam mailov z barvnimi status badge-i
- Tabs: "Čakalna vrsta" / "Poslani"
- Klik na mail prikaže podrobnosti (ali naloži ustrezen summary)

### 4. Posodobitev `Index.tsx`
- Dodan sidebar ali zgornji tab za preklapljanje med email editorjem in čakalno vrsto
- Lahko kot collapsible sidebar na levi

### 5. Nov hook `useEmailQueue.ts`
- Fetch iz `email_queue` tabele z realtime subscription

## Ocena obsega

Srednje velik feature — **~2-3 korake implementacije**:
1. DB migracija (nova tabela)
2. Edge function posodobitev
3. Frontend komponente (queue list, hook, layout update)

Ni pretežko, je pa potrebno nekaj korakov. Lahko začnemo?

