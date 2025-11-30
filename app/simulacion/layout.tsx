"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { QueryProvider } from "@/components/providers/query-provider";

export default function SimulacionLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
    </QueryProvider>
  );
}
