import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ComplianceDeadline {
  label: string;
  date: string;
  days: number;
  level: "green" | "yellow" | "red";
}

export interface ComplianceLawyer {
  name: string;
  spec: string;
  available: boolean;
  load: number;
}

export interface ComplianceData {
  case_id: string;
  povzetek_primera: string;
  pravna_podrocja: string[];
  panoge: string[];
  konflikt_interesov_level: "green" | "yellow" | "red";
  konflikt_interesov_label: string;
  aml_kyc_level: "green" | "yellow" | "red";
  aml_kyc_label: string;
  kompleksnost: number;
  kompleksnost_label: string;
  roki: ComplianceDeadline[];
  odvetniki: ComplianceLawyer[];
  povzetek: string[];
  priporocilo: string;
}

const emptyCompliance: ComplianceData = {
  case_id: "",
  povzetek_primera: "",
  pravna_podrocja: [],
  panoge: [],
  konflikt_interesov_level: "green",
  konflikt_interesov_label: "",
  aml_kyc_level: "green",
  aml_kyc_label: "",
  kompleksnost: 0,
  kompleksnost_label: "",
  roki: [],
  odvetniki: [],
  povzetek: [],
  priporocilo: "",
};

const mapRow = (row: any): ComplianceData => ({
  case_id: row.case_id ?? "",
  povzetek_primera: row.povzetek_primera ?? "",
  pravna_podrocja: row.pravna_podrocja ?? [],
  panoge: row.panoge ?? [],
  konflikt_interesov_level: row.konflikt_interesov_level ?? "green",
  konflikt_interesov_label: row.konflikt_interesov_label ?? "",
  aml_kyc_level: row.aml_kyc_level ?? "green",
  aml_kyc_label: row.aml_kyc_label ?? "",
  kompleksnost: row.kompleksnost ?? 0,
  kompleksnost_label: row.kompleksnost_label ?? "",
  roki: (row.roki ?? []).map((r: any) => (typeof r === "string" ? JSON.parse(r) : r)),
  odvetniki: (row.odvetniki ?? []).map((o: any) => (typeof o === "string" ? JSON.parse(o) : o)),
  povzetek: row.povzetek ?? [],
  priporocilo: row.priporocilo ?? "",
});

export function useCompliance() {
  const [data, setData] = useState<ComplianceData>(emptyCompliance);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("compliance")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && rows && rows.length > 0) {
        setData(mapRow(rows[0]));
      } else {
        setData(emptyCompliance);
      }
      setLoading(false);
    };

    fetchLatest();

    const channel = supabase
      .channel("compliance-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "compliance" },
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
