import { TextColor } from "@/types/lib/colorTypes";

export const iconos_actividad: Record<string, string> = {
  CORREO: "mail",
  LLAMADA: "phone",
  VISITA: "carro",
  "SALES LEAD": "entregar",
  SL: "entregar",
  "CALENDARIZAR COTIZACION": "calendario-agenda",
  "CALENDARIZAR CTS": "calendario1",
  "SOLICITAR COTIZACION": "calendario-agenda",
  "COTIZACION REALIZADA": "tarifa",
  COT: "tarifa",
  "CTS REALIZADO": "cuaderno",
  CTS: "cuaderno",
  "FILE REALIZADO": "carpeta",
  "FILE REALIZADO - MARITIMO": "carpeta",
  "FILE REALIZADO - TERRESTRE": "carpeta",
  "FILE REALIZADO - AEREO": "carpeta",
  "FINALIZAR SIN RESULTADOS": "circulo-x",
  "CONFIRMAR COTIZACION": "circulo-cheque",
  "SEGUIMIENTO COTIZACION": "calendario-agenda",
};

export const colores_estados: Record<string, TextColor> = {
  "EN PROCESO": "text-green-500",
  FINALIZADO: "text-destructive",
  // "EN SEGUIMIENTO": "accent.main",
  // "ANULADO": "warning.main"
};

export const colores_actividad: Record<string, TextColor> = {
  CORREO: "text-fuchsia-500",
  LLAMADA: "text-blue-500",
  VISITA: "text-indigo-300",
  // "SALES LEAD": "teal.main",
  // "SL": "teal.main",
  // "CALENDARIZAR COTIZACION": "lime.800",
  // "CALENDARIZAR CTS": "orange.main",
  // "COTIZACION REALIZADA": "cyan.600",
  // "COT": "cyan.600",
  // "CTS REALIZADO": "pink.600",
  // "CTS": "pink.600",
  // "FILE REALIZADO": "amber.main",
  // "FINALIZAR SIN RESULTADOS": "destructive.300",
  // "CONFIRMAR COTIZACION": "green.main",
  "SEGUIMIENTO COTIZACION": "text-lime-800",
  "SEGUIMIENTO CTS": "text-orange-500",
};
