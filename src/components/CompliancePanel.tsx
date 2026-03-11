import {
  Shield,
  Scale,
  Building2,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  CheckCircle2,
  XCircle,
  Eye,
  Briefcase,
  Timer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
    </div>
  );
}

export function CompliancePanel() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Pregled skladnosti</h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground">CASE-2026-0847</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Case summary */}
        <Card className="border p-4 shadow-sm">
          <SectionHeader icon={Briefcase} title="Povzetek primera" />
          <p className="text-sm leading-relaxed">
            Stranka Marko Horvat prosi za pravni pregled pogodbe o zaposlitvi pri podjetju TechCorp d.o.o. Pogodba
            vsebuje sporne klavzule glede konkurenčne prepovedi in delovnega časa.
          </p>
        </Card>

        {/* Classifications row */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={Scale} title="Pravno področje" />
            <div className="flex flex-wrap gap-1.5">
              {["Delovno pravo", "Pogodbeno pravo"].map((tag) => (
                <span key={tag} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={Building2} title="Klasifikacija panoge" />
            <div className="flex flex-wrap gap-1.5">
              {["Tehnologija", "IT storitve"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Risk indicators row */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={AlertTriangle} title="Konflikt interesov" />
            <StatusBadge level="green" label="Ni konflikta" />
          </Card>
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={Shield} title="AML/KYC tveganje" />
            <StatusBadge level="green" label="Nizko tveganje" />
          </Card>
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={BarChart3} title="Kompleksnost" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Srednja</span>
                <span className="text-xs text-muted-foreground">6/10</span>
              </div>
              <Progress value={60} className="h-1.5" />
            </div>
          </Card>
        </div>

        {/* Deadlines */}
        <Card className="border p-4 shadow-sm">
          <SectionHeader icon={Timer} title="Pravni roki" />
          <div className="space-y-3">
            {[
              { label: "Rok za pregled pogodbe", date: "14. 3. 2026", days: 3, level: "yellow" as const },
              { label: "Rok za ugovor", date: "28. 3. 2026", days: 17, level: "green" as const },
              { label: "Zastaralni rok", date: "11. 3. 2027", days: 365, level: "green" as const },
            ].map((deadline) => (
              <div key={deadline.label} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{deadline.label}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                </div>
                <StatusBadge
                  level={deadline.level}
                  label={`${deadline.days} ${deadline.days === 1 ? "dan" : deadline.days === 2 ? "dneva" : deadline.days <= 4 ? "dnevi" : "dni"}`}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Suggested lawyers */}
        <Card className="border p-4 shadow-sm">
          <SectionHeader icon={Users} title="Predlagani odvetniki" />
          <div className="space-y-2">
            {[
              { name: "dr. Ana Novak", spec: "Delovno pravo", available: true, load: 40 },
              { name: "mag. Peter Krajnc", spec: "Gospodarsko pravo", available: true, load: 65 },
              { name: "Maja Zupančič", spec: "Pogodbeno pravo", available: false, load: 90 },
            ].map((lawyer) => (
              <div key={lawyer.name} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {lawyer.name
                    .split(" ")
                    .map((n) => n.replace(/^(dr\.|mag\.)/, ""))
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{lawyer.name}</p>
                  <p className="text-xs text-muted-foreground">{lawyer.spec}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16">
                    <Progress value={lawyer.load} className="h-1" />
                  </div>
                  <span className={`h-2 w-2 rounded-full ${lawyer.available ? "bg-status-green" : "bg-status-red"}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Separator />

        {/* Recommendation */}
        <Card className="border p-4 shadow-sm">
          <SectionHeader icon={CheckCircle2} title="Priporočilo" />
          <div className="flex gap-3">
            <Button className="flex-1 gap-2 bg-status-green hover:bg-status-green/90 text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Sprejmi
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 border-status-yellow text-status-yellow hover:bg-status-yellow-bg"
            >
              <Eye className="h-4 w-4" />
              Preglej
            </Button>
            <Button variant="outline" className="flex-1 gap-2 border-status-red text-status-red hover:bg-status-red-bg">
              <XCircle className="h-4 w-4" />
              Zavrni
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
