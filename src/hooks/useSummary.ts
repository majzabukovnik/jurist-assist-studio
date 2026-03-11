import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Fetch latest entry
    const fetchLatest = async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("summaries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && rows && rows.length > 0) {
        setData(mapRow(rows[0]));
      } else {
        setData(emptyDraft);
      }
      setLoading(false);
    };

    fetchLatest();

    // Realtime subscription
    const channel = supabase
      .channel("summaries-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "summaries" },
        (payload) => {
          setData(mapRow(payload.new));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading };
}
