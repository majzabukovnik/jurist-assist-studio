import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EmailQueueItem {
  id: string;
  summary_id: string | null;
  to_name: string | null;
  to_email: string;
  subject: string;
  status: "pending" | "in_progress" | "sent" | "failed";
  sent_at: string | null;
  created_at: string;
}

export function useEmailQueue() {
  const [items, setItems] = useState<EmailQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("email_queue")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(data as EmailQueueItem[]);
      }
      setLoading(false);
    };

    fetch();

    const channel = supabase
      .channel("email-queue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_queue" },
        () => {
          // Refetch on any change
          fetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const pending = items.filter((i) => i.status === "pending" || i.status === "in_progress");
  const sent = items.filter((i) => i.status === "sent");
  const failed = items.filter((i) => i.status === "failed");

  return { items, pending, sent, failed, loading };
}
