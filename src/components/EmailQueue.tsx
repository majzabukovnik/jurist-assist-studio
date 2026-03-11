import { Mail, Clock, CheckCircle2, XCircle, Loader2, Inbox, Trash2, Archive, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEmailQueue, type EmailQueueItem, type EmailQueueStatus } from "@/hooks/useEmailQueue";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { toast } from "sonner";

const statusConfig: Record<EmailQueueStatus, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Čaka", icon: Clock, className: "bg-status-yellow-bg text-status-yellow" },
  in_progress: { label: "V obdelavi", icon: Loader2, className: "bg-status-yellow-bg text-status-yellow" },
  sent: { label: "Poslano", icon: Mail, className: "bg-primary/10 text-primary" },
  failed: { label: "Napaka", icon: XCircle, className: "bg-status-red-bg text-status-red" },
  accepted: { label: "Sprejeto", icon: CheckCircle2, className: "bg-status-green-bg text-status-green" },
  rejected: { label: "Zavrženo", icon: Trash2, className: "bg-status-red-bg text-status-red" },
};

function QueueItem({
  item,
  actions,
}: {
  item: EmailQueueItem;
  actions?: React.ReactNode;
}) {
  const config = statusConfig[item.status];
  const StatusIcon = config.icon;
  const time = format(new Date(item.created_at), "d. MMM, HH:mm", { locale: sl });

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.subject}</p>
        <p className="truncate text-xs text-muted-foreground">
          {item.to_name ? `${item.to_name} · ` : ""}{item.to_email}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-[10px] text-muted-foreground">{time}</p>
          <Badge variant="outline" className={`gap-1 border-0 text-[10px] ${config.className}`}>
            <StatusIcon className={`h-3 w-3 ${item.status === "in_progress" ? "animate-spin" : ""}`} />
            {config.label}
          </Badge>
        </div>
        {actions && <div className="mt-2 flex gap-1.5">{actions}</div>}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Inbox className="mb-2 h-8 w-8" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function TabCount({ count, className }: { count: number; className: string }) {
  if (count === 0) return null;
  return (
    <span className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${className}`}>
      {count}
    </span>
  );
}

const tabTriggerClass = "gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-2 pt-1.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none";

export function EmailQueue() {
  const { pending, sent, accepted, rejected, loading, updateStatus } = useEmailQueue();

  const handleAction = async (id: string, status: EmailQueueStatus, label: string) => {
    try {
      await updateStatus(id, status);
      toast.success(label);
    } catch {
      toast.error("Napaka pri posodabljanju statusa");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <Inbox className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight">Pošta</h2>
      </div>

      <Tabs defaultValue="queue" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-6">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger value="queue" className={tabTriggerClass}>
              Čakalna vrsta
              <TabCount count={pending.length} className="bg-status-yellow-bg text-status-yellow" />
            </TabsTrigger>
            <TabsTrigger value="sent" className={tabTriggerClass}>
              Poslani
              <TabCount count={sent.length} className="bg-primary/10 text-primary" />
            </TabsTrigger>
            <TabsTrigger value="accepted" className={tabTriggerClass}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Sprejeti
              <TabCount count={accepted.length} className="bg-status-green-bg text-status-green" />
            </TabsTrigger>
            <TabsTrigger value="rejected" className={tabTriggerClass}>
              <Trash2 className="h-3.5 w-3.5" />
              Koš
              <TabCount count={rejected.length} className="bg-status-red-bg text-status-red" />
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Čakalna vrsta */}
        <TabsContent value="queue" className="mt-0 flex-1 overflow-y-auto p-4">
          {pending.length === 0 ? (
            <EmptyState message="Ni mailov v čakalni vrsti" />
          ) : (
            <div className="space-y-2">
              {pending.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  actions={
                    <>
                      <Button
                        size="sm"
                        className="h-7 gap-1 bg-status-green text-xs hover:bg-status-green/90 text-primary-foreground"
                        onClick={() => handleAction(item.id, "accepted", "Email sprejet")}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Sprejmi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 border-status-red text-xs text-status-red hover:bg-status-red-bg"
                        onClick={() => handleAction(item.id, "rejected", "Email zavržen")}
                      >
                        <Trash2 className="h-3 w-3" />
                        Zavrni
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Poslani */}
        <TabsContent value="sent" className="mt-0 flex-1 overflow-y-auto p-4">
          {sent.length === 0 ? (
            <EmptyState message="Še ni poslanih mailov" />
          ) : (
            <div className="space-y-2">
              {sent.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  actions={
                    <>
                      <Button
                        size="sm"
                        className="h-7 gap-1 bg-status-green text-xs hover:bg-status-green/90 text-primary-foreground"
                        onClick={() => handleAction(item.id, "accepted", "Email sprejet")}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Sprejmi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 border-status-red text-xs text-status-red hover:bg-status-red-bg"
                        onClick={() => handleAction(item.id, "rejected", "Email zavržen")}
                      >
                        <Trash2 className="h-3 w-3" />
                        Zavrni
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Sprejeti */}
        <TabsContent value="accepted" className="mt-0 flex-1 overflow-y-auto p-4">
          {accepted.length === 0 ? (
            <EmptyState message="Ni sprejetih mailov" />
          ) : (
            <div className="space-y-2">
              {accepted.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  actions={
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1 text-xs text-muted-foreground"
                      onClick={() => handleAction(item.id, "sent", "Vrnjeno med poslane")}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Vrni nazaj
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Koš */}
        <TabsContent value="rejected" className="mt-0 flex-1 overflow-y-auto p-4">
          {rejected.length === 0 ? (
            <EmptyState message="Koš je prazen" />
          ) : (
            <div className="space-y-2">
              {rejected.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  actions={
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1 text-xs text-muted-foreground"
                      onClick={() => handleAction(item.id, "sent", "Obnovljeno med poslane")}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Obnovi
                    </Button>
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
