import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-background via-card to-background items-center justify-center p-12 border-r border-border/50">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 glow-yellow">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            SafetyOps Center
          </h1>
          <p className="text-xl text-primary mb-4">
            Mina Poderosa S.A.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Centro de Control de Seguridad - La Libertad, Peru
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-lg bg-card/50 border border-border/30">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Monitoreo continuo</p>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/30">
              <p className="text-2xl font-bold text-emerald-400">-45%</p>
              <p className="text-sm text-muted-foreground">Reduccion incidentes</p>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/30">
              <p className="text-2xl font-bold text-blue-400">120+</p>
              <p className="text-sm text-muted-foreground">Dispositivos IoT</p>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/30">
              <p className="text-2xl font-bold text-yellow-400">850</p>
              <p className="text-sm text-muted-foreground">Trabajadores</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        {children}
      </div>
    </div>
  );
}
