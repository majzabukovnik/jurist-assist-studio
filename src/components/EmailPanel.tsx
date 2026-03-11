import { Mail, Paperclip, Send, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { EmailDraft } from "@/types/emailDraft";
import { format } from "date-fns";
import { sl } from "date-fns/locale";

const sampleData: EmailDraft = {
  od: { ime: "Odvetniška pisarna Novak d.o.o.", email: "info@novak-law.si" },
  za: { ime: "Marko Horvat", email: "marko.horvat@email.si" },
  zadeva: "Re: Pregled pogodbe o zaposlitvi — Preliminarno mnenje",
  pozdrav: "Spoštovani gospod Horvat,",
  uvod: "zahvaljujemo se Vam za zaupanje in posredovano dokumentacijo. Po pregledu Vaše pogodbe o zaposlitvi Vam v nadaljevanju podajamo preliminarno pravno mnenje.",
  opis_problema:
    "Na podlagi informacij iz vašega sporočila razumemo, da se vaše vprašanje nanaša na [kratka opredelitev problema]. Po naši začetni oceni se zadeva nanaša predvsem na področje [PRAVNO PODROČJE], lahko pa vključuje tudi elemente [morebitna dodatna področja].",
  povzetek: [
    "ključna dejanska okoliščina",
    "ključna pravna ali poslovna situacija",
    "morebitni časovni ali poslovni kontekst",
  ],
  vprasanja: [
    "Ali ste že podpisali katerikoli dokument pri delodajalcu?",
    "Ali obstaja možnost pogajanj o pogojih pogodbe?",
    "Ali ste bili pri prejšnjem delodajalcu vezani s konkurenčno klavzulo?",
  ],
  pravna_ekipa: [
    { ime: "dr. Ana Novak", podrocje: "Delovno pravo", dostopen: true },
    { ime: "mag. Peter Krajnc", podrocje: "Gospodarsko pravo", dostopen: true },
  ],
  naslednji_koraki: [
    "Če vam ustreza, lahko v naslednjih dneh organiziramo tudi kratek uvodni klic, na katerem bi lahko podrobneje obravnavali vašo situacijo. Ali vam bi ustrezalo [IZBERI DATUM IN URO]?",
    "Posredujte odgovore na zgornja vprašanja.",
    "Priprava pogajalske strategije",
  ],
  podpis: "Odvetniška pisarna Novak d.o.o.",
  generirano: "2026-03-11T14:32:00Z",
};

interface EmailPanelProps {
  data?: EmailDraft;
}

export function EmailPanel({ data = sampleData }: EmailPanelProps) {
  const generiranoDatum = format(new Date(data.generirano), "d. M. yyyy, HH:mm", { locale: sl });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Email odgovor stranki</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            <Clock className="mr-1 h-3 w-3" />
            Osnutek
          </Badge>
          <span className="text-xs text-muted-foreground">Generirano: {generiranoDatum}</span>
        </div>
      </div>

      {/* Email content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="border shadow-sm">
          {/* Email header fields */}
          <div className="space-y-1 border-b p-4">
            <div className="flex items-center gap-2">
              <span className="w-14 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Od:</span>
              <span className="text-xs">{data.od.ime} &lt;{data.od.email}&gt;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Za:</span>
              <span className="text-xs">{data.za.ime} &lt;{data.za.email}&gt;</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Zadeva:</span>
              <span className="text-xs font-medium">{data.zadeva}</span>
            </div>
          </div>

          {/* Email body */}
          <div className="space-y-5 p-5 text-sm leading-relaxed">
            <p>{data.pozdrav}</p>
            <p>{data.uvod}</p>
            <p>{data.opis_problema}</p>

            {/* Legal summary */}
            <Card className="border bg-muted/30 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                POVZETEK VAŠE SITUACIJE
              </h4>
              <p className="text-sm whitespace-pre-line">
                {data.povzetek.map((item) => `• ${item}`).join("\n")}
              </p>
            </Card>

            {/* Follow-up questions */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                DODATNA VPRAŠANJA
              </h4>
              <ol className="space-y-1.5 pl-4">
                {data.vprasanja.map((vprasanje, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span>{vprasanje}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Separator />

            {/* Suggested legal team */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Predlagana pravna ekipa
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {data.pravna_ekipa.map((lawyer) => (
                  <div key={lawyer.ime} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{lawyer.ime}</p>
                      <p className="text-xs text-muted-foreground">{lawyer.podrocje}</p>
                    </div>
                    {lawyer.dostopen && <span className="ml-auto h-2 w-2 rounded-full bg-status-green" />}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Next steps */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Naslednji koraki
              </h4>
              <ul className="space-y-2">
                {data.naslednji_koraki.map((step, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4">
              S spoštovanjem,
              <br />
              <span className="font-medium">{data.podpis}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 border-t px-6 py-3">
        <Button size="sm" className="gap-1.5">
          <Send className="h-3.5 w-3.5" />
          Pošlji
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Paperclip className="h-3.5 w-3.5" />
          Priloži
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">AI generirano · n8n pipeline</span>
      </div>
    </div>
  );
}
