import { Mail, Paperclip, Send, Clock, User, Loader2, Plus, X, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { useSummary } from "@/hooks/useSummary";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function AutoResizeTextarea({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={resize}
      rows={1}
      className={`w-full resize-none border-0 bg-transparent p-0 text-sm leading-relaxed outline-none ring-0 transition-colors rounded px-1 -mx-1 hover:bg-muted/50 focus:bg-muted/50 ${className}`}
    />
  );
}

export function EmailPanel() {
  const { data, loading } = useSummary();

  const [pozdrav, setPozdrav] = useState("");
  const [uvod, setUvod] = useState("");
  const [opisProblema, setOpisProblema] = useState("");
  const [vprasanja, setVprasanja] = useState<string[]>([]);
  const [naslednjiKoraki, setNaslednjiKoraki] = useState<string[]>([]);
  const [zakljucek, setZakljucek] = useState("");
  const [podpis, setPodpis] = useState("");

  const resetToOriginal = useCallback(() => {
    setPozdrav(data.pozdrav);
    setUvod(data.uvod);
    setOpisProblema(data.opis_problema);
    setVprasanja([...data.vprasanja]);
    setNaslednjiKoraki([...data.naslednji_koraki]);
    setZakljucek(data.zakljucek);
    setPodpis(data.podpis);
  }, [data]);

  useEffect(() => {
    resetToOriginal();
  }, [resetToOriginal]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const generiranoDatum = format(new Date(data.generirano), "d. M. yyyy, HH:mm", { locale: sl });

  const updateListItem = (
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    value: string
  ) => {
    const next = [...list];
    next[index] = value;
    setList(next);
  };

  const removeListItem = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const addListItem = (list: string[], setList: (v: string[]) => void) => {
    setList([...list, ""]);
  };

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
          {/* Email header fields (read-only) */}
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

          {/* Email body (editable) */}
          <div className="space-y-5 p-5">
            <AutoResizeTextarea value={pozdrav} onChange={setPozdrav} />
            <AutoResizeTextarea value={uvod} onChange={setUvod} />
            <AutoResizeTextarea value={opisProblema} onChange={setOpisProblema} />

            {/* Follow-up questions */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                DODATNA VPRAŠANJA
              </h4>
              <ul className="space-y-1.5 pl-4">
                {vprasanja.map((v, i) => (
                  <li key={i} className="flex items-start gap-2 group">
                    <span className="text-primary text-[10px] shrink-0 mt-1.5">●</span>
                    <AutoResizeTextarea
                      value={v}
                      onChange={(val) => updateListItem(vprasanja, setVprasanja, i, val)}
                      className=""
                    />
                    <button
                      onClick={() => removeListItem(vprasanja, setVprasanja, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 gap-1 text-xs text-muted-foreground"
                onClick={() => addListItem(vprasanja, setVprasanja)}
              >
                <Plus className="h-3 w-3" />
                Dodaj vprašanje
              </Button>
            </div>

            <Separator />

            {/* Suggested legal team (read-only) */}
            {data.pravna_ekipa.length > 0 && (
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
            )}

            <Separator />

            {/* Next steps */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Naslednji koraki
              </h4>
              <ul className="space-y-1.5 pl-4">
                {naslednjiKoraki.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 group">
                    <span className="text-primary text-[10px] shrink-0 mt-1.5">●</span>
                    <AutoResizeTextarea
                      value={step}
                      onChange={(val) => updateListItem(naslednjiKoraki, setNaslednjiKoraki, i, val)}
                      className=""
                    />
                    <button
                      onClick={() => removeListItem(naslednjiKoraki, setNaslednjiKoraki, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 gap-1 text-xs text-muted-foreground"
                onClick={() => addListItem(naslednjiKoraki, setNaslednjiKoraki)}
              >
                <Plus className="h-3 w-3" />
                Dodaj korak
              </Button>
            </div>

            {zakljucek && (
              <AutoResizeTextarea value={zakljucek} onChange={setZakljucek} />
            )}

            {podpis && (
              <AutoResizeTextarea value={podpis} onChange={setPodpis} className="font-medium" />
            )}
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
        <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={resetToOriginal}>
          <RotateCcw className="h-3.5 w-3.5" />
          Ponastavi
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">AI generirano · n8n pipeline</span>
      </div>
    </div>
  );
}
