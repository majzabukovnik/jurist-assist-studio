import { Mail, Clock, CheckCircle2, XCircle, Loader2, Inbox } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEmailQueue, type EmailQueueItem } from "@/hooks/useEmailQueue";
import { format } from "date-fns";
import { sl } from "date-fns/locale";

const statusConfig = {
  pending: { label: "Čaka", icon: Clock, className: "bg-status-yellow-bg text-status-yellow" },
  in_progress: { label: "V obdelavi", icon: Loader2, className: "bg-status-yellow-bg text-status-yellow" },
  sent: { label: "Poslano", icon: CheckCircle2, className: "bg-status-green-bg text-status-green" },
  failed: { label: "Napaka", icon: XCircle, className: "bg-status-red-bg text-status-red" },
};

function QueueItem({ item }: { item: EmailQueueItem }) {
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
        <p className="mt-1 text-[10px] text-muted-foreground">{time}</p>
      </div>
      <Badge variant="outline" className={`shrink-0 gap-1 border-0 text-[10px] ${config.className}`}>
        <StatusIcon className={`h-3 w-3 ${item.status === "in_progress" ? "animate-spin" : ""}`} />
        {config.label}
      </Badge>
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

export function EmailQueue() {
  const { pending, sent, failed, loading } = useEmailQueue();

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
            <TabsTrigger value="queue" className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-2 pt-1.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Čakalna vrsta
              {pending.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-status-yellow-bg text-[10px] font-semibold text-status-yellow">
                  {pending.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-2 pt-1.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Poslani
              {sent.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-status-green-bg text-[10px] font-semibold text-status-green">
                  {sent.length}
                </span>
              )}
            </TabsTrigger>
            {failed.length > 0 && (
              <TabsTrigger value="failed" className="gap-1.5 rounded-none border-b-2 border-transparent px-3 pb-2 pt-1.5 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Napake
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-status-red-bg text-[10px] font-semibold text-status-red">
                  {failed.length}
                </span>
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="queue" className="mt-0 flex-1 overflow-y-auto p-4">
          {pending.length === 0 ? (
            <EmptyState message="Ni mailov v čakalni vrsti" />
          ) : (
            <div className="space-y-2">
              {pending.map((item) => (
                <QueueItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-0 flex-1 overflow-y-auto p-4">
          {sent.length === 0 ? (
            <EmptyState message="Še ni poslanih mailov" />
          ) : (
            <div className="space-y-2">
              {sent.map((item) => (
                <QueueItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        {failed.length > 0 && (
          <TabsContent value="failed" className="mt-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {failed.map((item) => (
                <QueueItem key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
