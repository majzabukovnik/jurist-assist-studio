import { Mail, Paperclip, Send, Clock, User, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { useSummary } from "@/hooks/useSummary";

export function EmailPanel() {
  const { data, loading } = useSummary();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Ni podatkov. Čakam na nov vnos iz n8n…
      </div>
    );
  }
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
                {data.vprasanja.map((vprasanje, i) =>
                <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span>{vprasanje}</span>
                  </li>
                )}
              </ol>
            </div>

            <Separator />

            {/* Suggested legal team */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Predlagana pravna ekipa
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {data.pravna_ekipa.map((lawyer) =>
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
                )}
              </div>
            </div>

            <Separator />

            {/* Next steps */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Naslednji koraki
              </h4>
              <ul className="space-y-2">
                {data.naslednji_koraki.map((step, i) =>
                <li key={i} className="flex items-center gap-2 text-sm">
                    {step}
                  </li>
                )}
              </ul>
            </div>

            <p className="mt-4">V kolikor imate vmes še kakšno vprašanje ali dodatne informacije, nam jih lahko kadarkoli posredujete.


S spoštovanjem,
Odvetniška pisarna Novak d.o.o.

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
    </div>);}