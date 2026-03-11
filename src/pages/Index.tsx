import { useState } from "react";
import { Bot, Bell, Settings, Search, Mail, Inbox } from "lucide-react";
import { EmailPanel } from "@/components/EmailPanel";
import { CompliancePanel } from "@/components/CompliancePanel";
import { EmailQueue } from "@/components/EmailQueue";

const Index = () => {
  const [leftTab, setLeftTab] = useState<"editor" | "queue">("editor");

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top nav */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight">LegalAI</span>
          <span className="text-xs text-muted-foreground">Pravni AI Asistent</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Left panel toggle */}
          <div className="mr-3 flex rounded-lg border bg-muted/50 p-0.5">
            <button
              onClick={() => setLeftTab("editor")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                leftTab === "editor"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              Editor
            </button>
            <button
              onClick={() => setLeftTab("queue")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                leftTab === "queue"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Inbox className="h-3.5 w-3.5" />
              Pošta
            </button>
          </div>
          <button className="rounded-lg p-2 hover:bg-muted transition-colors">
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="rounded-lg p-2 hover:bg-muted transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="rounded-lg p-2 hover:bg-muted transition-colors">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            AN
          </div>
        </div>
      </header>

      {/* Split screen */}
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 border-r overflow-hidden">
          {leftTab === "editor" ? <EmailPanel /> : <EmailQueue />}
        </div>
        <div className="flex-1 overflow-hidden">
          <CompliancePanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
