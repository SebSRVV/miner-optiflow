"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, AlertTriangle, CheckCircle, XCircle, Truck, TrafficCone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type SimulationState = "idle" | "running" | "success" | "accident";
type SemaforoState = "rojo" | "amarillo" | "verde";

interface VehiclePosition {
  x: number;
  y: number;
  rotation: number;
}

export default function SimulacionPage() {
  const [activeScenario, setActiveScenario] = useState<"exitoso" | "accidente">("exitoso");
  const [simulationState, setSimulationState] = useState<SimulationState>("idle");
  const [vehiclePosition, setVehiclePosition] = useState<VehiclePosition>({ x: 0, y: 50, rotation: 0 });
  const [semaforoState, setSemaforoState] = useState<SemaforoState>("rojo");
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(25);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const resetSimulation = useCallback(() => {
    setSimulationState("idle");
    setVehiclePosition({ x: 0, y: 50, rotation: 0 });
    setSemaforoState("rojo");
    setProgress(0);
    setSpeed(25);
    setShowAlert(false);
    setAlertMessage("");
  }, []);

  const runSuccessScenario = useCallback(() => {
    setSimulationState("running");
    let step = 0;
    const totalSteps = 100;

    const interval = setInterval(() => {
      step++;
      setProgress((step / totalSteps) * 100);

      if (step < 20) {
        setVehiclePosition({ x: step * 2, y: 50, rotation: 0 });
        setSpeed(25);
      } else if (step === 20) {
        setSemaforoState("amarillo");
        setAlertMessage("Semaforo en amarillo - Reducir velocidad");
        setShowAlert(true);
      } else if (step < 30) {
        setVehiclePosition({ x: step * 2, y: 50, rotation: 0 });
        setSpeed(15);
      } else if (step === 30) {
        setSemaforoState("rojo");
        setAlertMessage("Semaforo en rojo - Detenerse");
        setShowAlert(true);
      } else if (step < 50) {
        setVehiclePosition({ x: 60, y: 50, rotation: 0 });
        setSpeed(0);
      } else if (step === 50) {
        setSemaforoState("verde");
        setAlertMessage("Semaforo en verde - Continuar");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      } else if (step < 80) {
        setVehiclePosition({ x: 60 + (step - 50) * 1.5, y: 50, rotation: 0 });
        setSpeed(20);
      } else if (step < 100) {
        const curveProgress = (step - 80) / 20;
        setVehiclePosition({
          x: 105 + curveProgress * 30,
          y: 50 - curveProgress * 20,
          rotation: -curveProgress * 15,
        });
        setSpeed(15);
      } else {
        clearInterval(interval);
        setSimulationState("success");
        setShowAlert(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const runAccidentScenario = useCallback(() => {
    setSimulationState("running");
    let step = 0;
    const totalSteps = 60;

    const interval = setInterval(() => {
      step++;
      setProgress((step / totalSteps) * 100);

      if (step < 20) {
        setVehiclePosition({ x: step * 3, y: 50, rotation: 0 });
        setSpeed(35);
      } else if (step === 20) {
        setSemaforoState("amarillo");
        setAlertMessage("ALERTA: Semaforo en amarillo");
        setShowAlert(true);
      } else if (step < 30) {
        setVehiclePosition({ x: step * 3, y: 50, rotation: 0 });
        setSpeed(40);
        setAlertMessage("PELIGRO: Exceso de velocidad detectado!");
      } else if (step === 30) {
        setSemaforoState("rojo");
        setAlertMessage("CRITICO: Semaforo en rojo - Vehiculo no se detiene!");
      } else if (step < 45) {
        setVehiclePosition({ x: step * 3, y: 50, rotation: 0 });
        setSpeed(45);
      } else if (step < 55) {
        const crashProgress = (step - 45) / 10;
        setVehiclePosition({
          x: 135 + crashProgress * 10,
          y: 50 + crashProgress * 30,
          rotation: crashProgress * 45,
        });
        setSpeed(0);
        setAlertMessage("ACCIDENTE: Vehiculo fuera de control!");
      } else {
        clearInterval(interval);
        setSimulationState("accident");
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const startSimulation = () => {
    resetSimulation();
    if (activeScenario === "exitoso") {
      runSuccessScenario();
    } else {
      runAccidentScenario();
    }
  };

  const getSemaforoColor = (state: SemaforoState) => {
    switch (state) {
      case "verde": return "#10b981";
      case "amarillo": return "#eab308";
      case "rojo": return "#ef4444";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Simulacion de Seguridad</h1>
            <p className="text-muted-foreground mt-1">Entrada a Mina Poderosa - Sistema de Semaforizacion</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={startSimulation} disabled={simulationState === "running"} className="bg-emerald-600 hover:bg-emerald-700">
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </Button>
            <Button onClick={resetSimulation} variant="outline" className="border-border/50">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeScenario} onValueChange={(v) => { setActiveScenario(v as "exitoso" | "accidente"); resetSimulation(); }}>
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="exitoso" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <CheckCircle className="h-4 w-4 mr-2" />
            Caso Exitoso
          </TabsTrigger>
          <TabsTrigger value="accidente" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            <XCircle className="h-4 w-4 mr-2" />
            Caso de Accidente
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 bg-card border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <TrafficCone className="h-5 w-5 text-primary" />
              Vista de Entrada a Mina - Rampa Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[500px] bg-gradient-to-b from-slate-800 via-slate-700 to-amber-900/50 overflow-hidden">
              {/* Cielo y montanas */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900 to-slate-800" />
              <svg className="absolute top-8 left-0 w-full h-32" viewBox="0 0 400 60" preserveAspectRatio="none">
                <polygon points="0,60 50,20 100,45 150,15 200,40 250,10 300,35 350,20 400,60" fill="#374151" />
                <polygon points="0,60 30,35 80,50 130,25 180,45 230,20 280,40 330,25 380,45 400,60" fill="#4b5563" />
              </svg>

              {/* Barranco izquierdo */}
              <div className="absolute left-0 top-32 bottom-0 w-24 bg-gradient-to-r from-amber-950 via-amber-900 to-transparent">
                <div className="absolute inset-0 opacity-50">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute bg-amber-800/50 rounded" style={{ left: `${i * 10}%`, top: `${i * 12}%`, width: "30px", height: "8px", transform: `rotate(${-15 + i * 5}deg)` }} />
                  ))}
                </div>
              </div>

              {/* Barranco derecho */}
              <div className="absolute right-0 top-32 bottom-0 w-24 bg-gradient-to-l from-amber-950 via-amber-900 to-transparent">
                <div className="absolute inset-0 opacity-50">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute bg-amber-800/50 rounded" style={{ right: `${i * 10}%`, top: `${i * 12}%`, width: "30px", height: "8px", transform: `rotate(${15 - i * 5}deg)` }} />
                  ))}
                </div>
              </div>

              {/* Pista/Carretera */}
              <div className="absolute left-24 right-24 top-[45%] h-24 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 transform -skew-y-1">
                {/* Lineas de carretera */}
                <div className="absolute inset-x-0 top-1/2 h-1 flex gap-8 px-4">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="w-12 h-full bg-yellow-400/80" />
                  ))}
                </div>
                {/* Bordes de carretera */}
                <div className="absolute inset-x-0 top-0 h-1 bg-white/50" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/50" />
              </div>

              {/* Entrada al tunel (derecha) */}
              <div className="absolute right-16 top-[30%] w-32 h-40">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-t-full border-4 border-gray-700" />
                <div className="absolute inset-2 bg-black rounded-t-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-white/50 font-bold">NIVEL 2000</div>
              </div>

              {/* Semaforo */}
              <motion.div className="absolute left-[55%] top-[32%] flex flex-col items-center" animate={{ scale: simulationState === "running" ? [1, 1.05, 1] : 1 }} transition={{ repeat: Infinity, duration: 1 }}>
                <div className="w-3 h-16 bg-gray-700 rounded" />
                <div className="bg-gray-800 rounded-lg p-2 border-2 border-gray-600 shadow-xl">
                  <div className="flex flex-col gap-2">
                    <motion.div className={`w-8 h-8 rounded-full border-2 border-gray-600 ${semaforoState === "rojo" ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]" : "bg-red-900/30"}`} animate={semaforoState === "rojo" ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                    <motion.div className={`w-8 h-8 rounded-full border-2 border-gray-600 ${semaforoState === "amarillo" ? "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.8)]" : "bg-yellow-900/30"}`} animate={semaforoState === "amarillo" ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                    <motion.div className={`w-8 h-8 rounded-full border-2 border-gray-600 ${semaforoState === "verde" ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" : "bg-emerald-900/30"}`} animate={semaforoState === "verde" ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} />
                  </div>
                </div>
              </motion.div>

              {/* Vehiculo (Camion/Scooptram) */}
              <motion.div
                className="absolute"
                style={{ left: `${24 + vehiclePosition.x * 0.6}%`, top: `${vehiclePosition.y}%` }}
                animate={{ x: 0, y: 0, rotate: vehiclePosition.rotation }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className={`relative ${simulationState === "accident" ? "animate-pulse" : ""}`}>
                  {/* Cuerpo del camion */}
                  <div className="w-20 h-10 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-lg border-2 border-yellow-700 shadow-lg">
                    <div className="absolute top-1 left-1 w-6 h-6 bg-blue-400/50 rounded border border-blue-300/50" />
                    <div className="absolute bottom-0 left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600" />
                    <div className="absolute bottom-0 right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600" />
                  </div>
                  {/* Luces */}
                  {simulationState === "running" && (
                    <motion.div className="absolute -top-1 left-0 right-0 flex justify-between px-1" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.3 }}>
                      <div className="w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                      <div className="w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
                    </motion.div>
                  )}
                  {/* Etiqueta */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-gray-800/80 px-2 rounded">SC-003</div>
                </div>
              </motion.div>

              {/* Alerta flotante */}
              <AnimatePresence>
                {showAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl border-2 ${
                      semaforoState === "rojo" ? "bg-red-500/90 border-red-400 text-white" :
                      semaforoState === "amarillo" ? "bg-yellow-500/90 border-yellow-400 text-black" :
                      "bg-emerald-500/90 border-emerald-400 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-bold">{alertMessage}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resultado final */}
              <AnimatePresence>
                {simulationState === "success" && (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-emerald-500/90 text-white px-8 py-6 rounded-xl shadow-2xl border-2 border-emerald-400 text-center">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Operacion Exitosa</h2>
                      <p>El vehiculo respeto las senales y cruzo de forma segura</p>
                    </div>
                  </motion.div>
                )}
                {simulationState === "accident" && (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-red-500/90 text-white px-8 py-6 rounded-xl shadow-2xl border-2 border-red-400 text-center">
                      <XCircle className="h-16 w-16 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Accidente Registrado</h2>
                      <p>El vehiculo ignoro el semaforo y perdio el control</p>
                      <p className="text-sm mt-2 opacity-80">Causa: Exceso de velocidad + Semaforo ignorado</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Panel de informacion */}
        <div className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className="text-2xl font-bold" style={{ color: getSemaforoColor(semaforoState) }}>{semaforoState.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">Semaforo</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30 text-center">
                  <p className={`text-2xl font-bold ${speed > 30 ? "text-red-400" : speed > 20 ? "text-yellow-400" : "text-emerald-400"}`}>{speed}</p>
                  <p className="text-xs text-muted-foreground">km/h</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Scooptram SC-003</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Operador: Carlos Mendoza</p>
                  <p>Turno: Dia - Guardia A</p>
                  <p>Zona: Rampa Principal</p>
                </div>
              </div>

              <Badge className={`w-full justify-center py-2 ${
                simulationState === "idle" ? "bg-gray-500/20 text-gray-400" :
                simulationState === "running" ? "bg-blue-500/20 text-blue-400" :
                simulationState === "success" ? "bg-emerald-500/20 text-emerald-400" :
                "bg-red-500/20 text-red-400"
              }`}>
                {simulationState === "idle" ? "Esperando inicio" :
                 simulationState === "running" ? "Simulacion en curso" :
                 simulationState === "success" ? "Completado exitosamente" :
                 "Accidente ocurrido"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Descripcion del Escenario</CardTitle>
            </CardHeader>
            <CardContent>
              {activeScenario === "exitoso" ? (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong className="text-emerald-400">Caso Exitoso:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>El vehiculo detecta el semaforo en amarillo</li>
                    <li>Reduce velocidad gradualmente</li>
                    <li>Se detiene completamente en rojo</li>
                    <li>Espera la luz verde para continuar</li>
                    <li>Ingresa al tunel de forma segura</li>
                  </ul>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong className="text-red-400">Caso de Accidente:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>El vehiculo circula a exceso de velocidad</li>
                    <li>Ignora la senal de amarillo</li>
                    <li>No se detiene en el semaforo rojo</li>
                    <li>Pierde el control en la curva</li>
                    <li>Cae hacia el barranco lateral</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
