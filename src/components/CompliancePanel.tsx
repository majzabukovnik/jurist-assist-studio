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
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { useCompliance } from "@/hooks/useCompliance";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
    </div>
  );
}

export function CompliancePanel() {
  const { data, loading } = useCompliance();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Pregled skladnosti</h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{data.case_id || "—"}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Case summary */}
        <Card className="border p-4 shadow-sm">
          <SectionHeader icon={Briefcase} title="Povzetek primera" />
          {data.povzetek_primera ? (
            <ul className="space-y-1 text-sm">
              {data.povzetek_primera
                .split(/(?<![dsop]\s?)(?<=\.)\s+(?=[A-ZČŠŽ])/)
                .filter(Boolean)
                .map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
          {(data.povzetek ?? []).length > 0 && (
            <div className="mt-3 rounded-lg border bg-muted/30 p-3">
              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Povzetek situacije
              </h5>
              <ul className="space-y-1 text-sm">
                {data.povzetek.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Classifications row */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={Scale} title="Pravno področje" />
            <div className="flex flex-wrap gap-1.5">
              {data.pravna_podrocja.map((tag) => (
                <span key={tag} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={Building2} title="Klasifikacija panoge" />
            <div className="flex flex-wrap gap-1.5">
              {data.panoge.map((tag) => (
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
          <Card className="group border p-4 shadow-sm transition-all hover:shadow-md cursor-default">
            <SectionHeader icon={AlertTriangle} title="Konflikt interesov" />
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${data.konflikt_interesov_level === "red" ? "bg-status-red" : data.konflikt_interesov_level === "yellow" ? "bg-status-yellow" : "bg-status-green"}`} />
              <span className="text-sm text-muted-foreground">
                <span className="group-hover:hidden">
                  {data.konflikt_interesov_level === "green" ? "Ni konflikta" : "Je konflikt"}
                </span>
                <span className="hidden group-hover:inline">
                  {data.konflikt_interesov_label || "—"}
                </span>
              </span>
            </div>
          </Card>
          <Card className="group border p-4 shadow-sm transition-all hover:shadow-md cursor-default">
            <SectionHeader icon={Shield} title="AML/KYC tveganje" />
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${data.aml_kyc_level === "red" ? "bg-status-red" : data.aml_kyc_level === "yellow" ? "bg-status-yellow" : "bg-status-green"}`} />
              <span className="text-sm text-muted-foreground">
                <span className="group-hover:hidden">
                  {data.aml_kyc_level === "green" ? "Nizko tveganje" : data.aml_kyc_level === "yellow" ? "Srednje tveganje" : "Visoko tveganje"}
                </span>
                <span className="hidden group-hover:inline">
                  {data.aml_kyc_label || "—"}
                </span>
              </span>
            </div>
          </Card>
          <Card className="group border p-4 shadow-sm transition-all hover:shadow-md cursor-default">
            <SectionHeader icon={BarChart3} title="Kompleksnost" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  <span className="group-hover:hidden">
                    {data.kompleksnost <= 3 ? "Nizka" : data.kompleksnost <= 6 ? "Srednja" : "Visoka"}
                  </span>
                  <span className="hidden group-hover:inline">
                    {data.kompleksnost_label || "—"}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">{data.kompleksnost}/10</span>
              </div>
              <Progress value={data.kompleksnost * 10} className="h-1.5" />
            </div>
          </Card>
        </div>

        {/* Deadlines */}
        {data.roki.length > 0 && (
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={Timer} title="Pravni roki" />
            <div className="space-y-3">
              {data.roki.map((deadline) => (
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
        )}

        {/* Suggested lawyers */}
        {data.odvetniki.length > 0 && (
          <Card className="border p-4 shadow-sm">
            <SectionHeader icon={Users} title="Predlagani odvetniki" />
            <div className="space-y-2">
              {data.odvetniki.map((lawyer) => (
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
        )}

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
