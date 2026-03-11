import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { EmailDraft } from "@/types/emailDraft";

const emptyDraft: EmailDraft = {
  od: { ime: "", email: "" },
  za: { ime: "", email: "" },
  zadeva: "",
  pozdrav: "",
  uvod: "",
  opis_problema: "",
  povzetek: [],
  vprasanja: [],
  pravna_ekipa: [],
  naslednji_koraki: [],
  zakljucek: "",
  podpis: "",
  generirano: new Date().toISOString(),
};

export function useSummary() {
  const [data, setData] = useState<EmailDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const currentRef = useRef<EmailDraft>(emptyDraft);

  const mapRow = (row: any): EmailDraft => ({
    od: { ime: row.od_ime ?? "", email: row.od_email ?? "" },
    za: { ime: row.za_ime ?? "", email: row.za_email ?? "" },
    zadeva: row.zadeva ?? "",
    pozdrav: row.pozdrav ?? "",
    uvod: row.uvod ?? "",
    opis_problema: row.opis_problema ?? "",
    povzetek: row.povzetek ?? [],
    vprasanja: row.vprasanja ?? [],
    pravna_ekipa: [],
    naslednji_koraki: row.naslednji_koraki ?? [],
    zakljucek: row.zakljucek ?? "",
    podpis: row.od_ime ?? "",
    generirano: row.created_at,
  });

  const moveToPending = async (draft: EmailDraft) => {
    if (!draft.za.email || !draft.zadeva) return;
    await supabase.from("email_queue").insert({
      to_name: draft.za.ime,
      to_email: draft.za.email,
      subject: draft.zadeva,
      status: "pending",
    });
  };

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("summaries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && rows && rows.length > 0) {
        const mapped = mapRow(rows[0]);
        setData(mapped);
        currentRef.current = mapped;
      } else {
        setData(emptyDraft);
        currentRef.current = emptyDraft;
      }
      setLoading(false);
    };

    fetchLatest();

    const channel = supabase
      .channel("summaries-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "summaries" },
        async (payload) => {
          // Move current email to pending queue before switching
          await moveToPending(currentRef.current);

          const mapped = mapRow(payload.new);
          setData(mapped);
          currentRef.current = mapped;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading };
}
