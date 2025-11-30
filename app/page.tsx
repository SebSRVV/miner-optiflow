"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Truck, AlertTriangle, BarChart3, MapPin, Play, Zap, Users, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const features = [
  {
    icon: Truck,
    title: "Control de Flota",
    description: "Monitoreo GPS en tiempo real de camiones, scooptrams y vehiculos en interior mina.",
    color: "blue"
  },
  {
    icon: AlertTriangle,
    title: "Sistema de Alarmas",
    description: "Alertas automaticas por exceso de velocidad, proximidad y zonas de riesgo.",
    color: "red"
  },
  {
    icon: BarChart3,
    title: "Metricas y KPIs",
    description: "Dashboards con indicadores de seguridad y productividad operacional.",
    color: "emerald"
  },
  {
    icon: MapPin,
    title: "Semaforizacion",
    description: "Control de trafico en cruces y accesos criticos de operaciones subterraneas.",
    color: "purple"
  },
  {
    icon: Radio,
    title: "IoT Industrial",
    description: "Sensores de proximidad, gases, velocidad y dispositivos conectados.",
    color: "orange"
  },
  {
    icon: Users,
    title: "Gestion de Personal",
    description: "Control de acceso y ubicacion de trabajadores en tiempo real.",
    color: "cyan"
  }
];

const stats = [
  { value: "-45%", label: "Reduccion de incidentes", color: "text-primary" },
  { value: "500+", label: "Dispositivos IoT", color: "text-emerald-400" },
  { value: "24/7", label: "Monitoreo continuo", color: "text-blue-400" },
  { value: "99.9%", label: "Uptime del sistema", color: "text-yellow-400" }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    red: "bg-red-500/10 border-red-500/20 text-red-500",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-500",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-500",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500"
  };
  return colors[color] || colors.blue;
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"
            >
              <Shield className="h-6 w-6 text-primary" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">SafetyOps Center</span>
              <span className="text-xs text-muted-foreground">Sistema de Prevencion Minera</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/simulacion">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                <Play className="h-4 w-4 mr-2" />
                Ver Demo
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
      </motion.header>

      <main>
        <section className="container mx-auto px-6 py-24 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 glow-yellow">
              <Shield className="h-14 w-14 text-primary" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Centro de Operaciones de
            <span className="text-primary"> Seguridad Minera</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6"
          >
            Plataforma integral para el monitoreo, control y prevencion de incidentes 
            en operaciones mineras subterraneas y a cielo abierto.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-muted-foreground mb-10"
          >
            <Zap className="h-5 w-5 text-primary" />
            <span>Tecnologia IoT + Inteligencia Artificial + Tiempo Real</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-4"
          >
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
          </motion.div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg border mb-4 ${getColorClasses(feature.color)}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-card border border-border/50 rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Listo para mejorar la seguridad de tu operacion?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unete a las empresas mineras que ya confian en SafetyOps Center para proteger a sus trabajadores y optimizar sus operaciones.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Crear Cuenta Gratis
                </Button>
              </Link>
              <Link href="/simulacion">
                <Button size="lg" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Ver Demostracion
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>2024 SafetyOps Center - Sistema de Prevencion y Seguridad Minera</p>
        </div>
      </footer>
    </div>
  );
}
