import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type EmailQueueStatus = "pending" | "in_progress" | "sent" | "failed" | "accepted" | "rejected";

export interface EmailQueueItem {
  id: string;
  summary_id: string | null;
  to_name: string | null;
  to_email: string;
  subject: string;
  status: EmailQueueStatus;
  sent_at: string | null;
  created_at: string;
}

export function useEmailQueue() {
  const [items, setItems] = useState<EmailQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("email_queue")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data as EmailQueueItem[]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchItems().finally(() => setLoading(false));

    const channel = supabase
      .channel("email-queue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_queue" },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  const updateStatus = useCallback(async (id: string, status: EmailQueueStatus) => {
    await supabase
      .from("email_queue")
      .update({ status, ...(status === "sent" ? { sent_at: new Date().toISOString() } : {}) })
      .eq("id", id);
  }, []);

  const pending = items.filter((i) => i.status === "pending" || i.status === "in_progress");
  const sent = items.filter((i) => i.status === "sent");
  const failed = items.filter((i) => i.status === "failed");
  const accepted = items.filter((i) => i.status === "accepted");
  const rejected = items.filter((i) => i.status === "rejected");

  return { items, pending, sent, failed, accepted, rejected, loading, updateStatus };
}
