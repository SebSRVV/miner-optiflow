import Link from "next/link";
import { Shield, ArrowRight, Truck, AlertTriangle, BarChart3, MapPin, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">SafetyOps Center</span>
              <span className="text-xs text-muted-foreground">Mina Poderosa - La Libertad</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/simulacion">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                <Play className="h-4 w-4 mr-2" />
                Ver Simulacion
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Iniciar Sesion</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary text-primary-foreground">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 glow-yellow">
              <Shield className="h-14 w-14 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Centro de Operaciones de
            <span className="text-primary"> Seguridad Minera</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Plataforma integral para el monitoreo, control y prevencion de incidentes en Mina Poderosa.
          </p>
          <p className="text-lg text-primary/80 mb-10">
            La Libertad, Peru - Operacion de Oro Subterranea
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Control de Flota</h3>
              <p className="text-muted-foreground text-sm">
                Monitoreo GPS en tiempo real de camiones, scooptrams y vehiculos en interior mina.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sistema de Alarmas</h3>
              <p className="text-muted-foreground text-sm">
                Alertas automaticas por exceso de velocidad, proximidad y zonas de riesgo en tuneles.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <BarChart3 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Metricas y KPIs</h3>
              <p className="text-muted-foreground text-sm">
                Dashboards con indicadores de seguridad y productividad de la operacion.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 mb-4">
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Semaforizacion</h3>
              <p className="text-muted-foreground text-sm">
                Control de trafico en cruces y accesos criticos de la mina subterranea.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">-45%</p>
              <p className="text-muted-foreground">Reduccion de incidentes</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-400">120+</p>
              <p className="text-muted-foreground">Dispositivos IoT</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400">24/7</p>
              <p className="text-muted-foreground">Monitoreo continuo</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-400">850</p>
              <p className="text-muted-foreground">Trabajadores protegidos</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>2024 SafetyOps Center - Mina Poderosa S.A. La Libertad, Peru</p>
        </div>
      </footer>
    </div>
  );
}
