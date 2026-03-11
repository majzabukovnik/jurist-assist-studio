

## Plan: Uredljiva vsebina emaila

Uporabniku omogočimo urejanje **telesa emaila** (pozdrav, uvod, opis problema, vprašanja, naslednji koraki, zaključek, podpis), medtem ko glava emaila (Od, Za, Zadeva) in ostali metapodatki ostanejo read-only.

### Pristop

V `EmailPanel.tsx` dodamo lokalni state z `useState`, inicializiran iz `useSummary()` podatkov. Vsako besedilno polje v telesu emaila postane klikljivo/uredljivo:

- **Kratka besedila** (pozdrav, uvod, opis_problema, zaključek, podpis): inline `<textarea>` s transparentnim ozadjem, ki vizualno izgleda kot navadno besedilo, a je uredljivo.
- **Seznami** (vprasanja, naslednji_koraki): vsak element je uredljiv input. Dodamo gumb za dodajanje/brisanje elementov.
- **Pravna ekipa sekcija**: ostane read-only (ni del vsebine emaila).

### Spremembe datotek

1. **`src/components/EmailPanel.tsx`**:
   - Dodamo `useState` za lokalno kopijo uredljivih polj (`editableData`), inicializirano iz `data` ob prvem nalaganju in ob spremembi `data` (realtime).
   - Zamenjamo statične `<p>` elemente z `<textarea>` komponentami (auto-resize, brez okvirja, transparentno ozadje).
   - Za sezname (vprašanja, naslednji koraki) vsak element postane `<input>`, z gumbi `+` za dodajanje in `×` za brisanje.
   - Dodamo gumb "Ponastavi" v footer, ki resetira na originalne AI-generirane podatke.
   - Vizualno: uredljiva polja dobijo rahel hover efekt (npr. `hover:bg-muted/50`) za nakazovanje uredljivosti.

### UX detajli

- Polja izgledajo enako kot zdaj, le da so uredljiva (seamless editing).
- Ob hoveru se prikaže rahel ozadje, ki nakazuje, da je polje uredljivo.
- Textarea se samodejno prilagaja višini vsebine.
- Spremembe so samo lokalne (client-side) -- ne shranjujemo nazaj v bazo.

