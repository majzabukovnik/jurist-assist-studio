import { Mail, Paperclip, Send, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function EmailPanel() {
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
          <span className="text-xs text-muted-foreground">Generirano: 11. 3. 2026, 14:32</span>
        </div>
      </div>

      {/* Email content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="border shadow-sm">
          {/* Email header fields */}
          <div className="space-y-1.4 border-b p-5">
            <div className="flex items-center gap-3">
              <span className="w-10 text-xs font-medium text-muted-foreground uppercase tracking-wider">Od:</span>
              <span className="text-sm">Odvetniška pisarna Novak d.o.o. &lt;info@novak-law.si&gt;</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-xs font-medium text-muted-foreground uppercase tracking-wider">Za:</span>
              <span className="text-sm">Marko Horvat &lt;marko.horvat@email.si&gt;</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-xs font-medium text-muted-foreground uppercase tracking-wider">Zadeva:</span>
              <span className="text-sm font-medium">Re: Pregled pogodbe o zaposlitvi — Preliminarno mnenje</span>
            </div>
          </div>

          {/* Email body */}
          <div className="space-y-5 p-5 text-sm leading-relaxed">
            <p>Spoštovani gospod Horvat,</p>

            <p>
              zahvaljujemo se Vam za zaupanje in posredovano dokumentacijo. Po pregledu Vaše pogodbe o zaposlitvi Vam v
              nadaljevanju podajamo preliminarno pravno mnenje.
            </p>

            <p>
              Na podlagi informacij iz vašega sporočila razumemo, da se vaše vprašanje nanaša na [kratka opredelitev
              problema]. Po naši začetni oceni se zadeva nanaša predvsem na področje [PRAVNO PODROČJE], lahko pa
              vključuje tudi elemente [morebitna dodatna področja].
            </p>

            {/* Legal summary */}
            <Card className="border bg-muted/30 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                POVZETEK VAŠE SITUACIJE
              </h4>
              <p className="text-sm whitespace-pre-line">
                {
                  "• [ključna dejanska okoliščina]\n• [ključna pravna ali poslovna situacija]\n• [morebitni časovni ali poslovni kontekst]"
                }
              </p>
            </Card>

            {/* Follow-up questions */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dodatna vprašanja za stranko
              </h4>
              <ol className="space-y-1.4 pl-4">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    1
                  </span>
                  <span>Ali ste že podpisali katerikoli dokument pri delodajalcu?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    2
                  </span>
                  <span>Ali obstaja možnost pogajanj o pogojih pogodbe?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    3
                  </span>
                  <span>Ali ste bili pri prejšnjem delodajalcu vezani s konkurenčno klavzulo?</span>
                </li>
              </ol>
            </div>

            <Separator />

            {/* Suggested legal team */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Predlagana pravna ekipa
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "dr. Ana Novak", role: "Delovno pravo", available: true },
                  { name: "mag. Peter Krajnc", role: "Gospodarsko pravo", available: true },
                ].map((lawyer) => (
                  <div key={lawyer.name} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{lawyer.name}</p>
                      <p className="text-xs text-muted-foreground">{lawyer.role}</p>
                    </div>
                    {lawyer.available && <span className="ml-auto h-2 w-2 rounded-full bg-status-green" />}
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
                {[
                  "Posredujte odgovore na zgornja vprašanja",
                  "Sestanek za pregled pogodbe — predlog: 14. 3. 2026",
                  "Priprava pogajalske strategije",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4">
              S spoštovanjem,
              <br />
              <span className="font-medium">Odvetniška pisarna Novak d.o.o.</span>
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
