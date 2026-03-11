import { Bot, Bell, Settings, Search } from "lucide-react";
import { EmailPanel } from "@/components/EmailPanel";
import { CompliancePanel } from "@/components/CompliancePanel";

const Index = () => {
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
          <EmailPanel />
        </div>
        <div className="flex-1 overflow-hidden">
          <CompliancePanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
