/**
 * Sistema de Iconos Centralizado
 *
 * Este archivo actúa como traductor entre:
 * - nombres legacy / nombres de otra librería
 * - aliases internos del proyecto
 * - nombres reales de iconos de lucide-react
 *
 * Objetivos:
 * - evitar mantener manualmente un objeto gigante con todos los iconos
 * - soportar nombres legacy (ej. `c-camion`, `usuario`, `briefcase-business`)
 * - soportar aliases semánticos internos (ej. `Document`, `Business`, `Notification`)
 * - resolver automáticamente cualquier icono real exportado por lucide-react
 */

import * as LucideIcons from "lucide-react";
import type { ComponentType, SVGProps } from "react";

// ============================================
// Tipos base
// ============================================

export type LucideIconsMap = typeof LucideIcons;
export type LucideIconName = Extract<keyof LucideIconsMap, string>;

export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & {
    className?: string;
    size?: number | string;
    strokeWidth?: number | string;
  }
>;

/**
 * Nota:
 * `IconName` representa tanto nombres reales de Lucide como aliases internos.
 * Se deja como string para soportar runtime names provenientes de API / BD / legacy.
 */
export type IconName = string;

// ============================================
// Aliases internos del proyecto
// ============================================

/**
 * Alias amigables / semánticos del proyecto.
 * La key es el nombre que puede venir en runtime.
 * El value es el nombre real exportado por lucide-react.
 */
const ICON_ALIASES = {
  Close: "X",
  Pencil: "Edit2",
  Refresh: "RefreshCw",
  Document: "FileText",
  Excel: "FileSpreadsheet",
  Alert: "AlertCircle",
  Warning: "AlertTriangle",
  Information: "Info",
  Help: "HelpCircle",
  Success: "CheckCircle",
  Error: "XCircle",
  Notification: "Bell",
  Profile: "CircleUser",
  Verified: "BadgeCheck",
  View: "Eye",
  Hide: "EyeOff",
  Hamburger: "Menu",
  Sidebar: "PanelLeft",
  Maximize: "Maximize2",
  Minimize: "Minimize2",
  Loader: "Loader2",
  Spinner: "Loader2",
  Grid: "LayoutGrid",
  Time: "Clock",
  Dollar: "DollarSign",
  Money: "DollarSign",
  Card: "CreditCard",
  Invoice: "Receipt",
  Cart: "ShoppingCart",
  Bag: "ShoppingBag",
  Location: "MapPin",
  Pin: "MapPin",
  Email: "Mail",
  Message: "MessageSquare",
  Chat: "MessageSquare",
  Telephone: "Phone",
  Office: "Building",
  Business: "Briefcase",
  Bank: "Landmark",
  Shop: "Store",
  Branch: "GitBranch",
  Number: "Hash",
  Percentage: "Percent",
  Chart: "BarChart",
  Meter: "Gauge",
  Label: "Tag",
  Labels: "Tags",
  Favorite: "Star",
  Like: "Heart",
  Prize: "Trophy",
  Locked: "Lock",
  Unlocked: "Unlock",
  Security: "Shield",
  QR: "QrCode",
  Scan: "ScanLine",
  Light: "Sun",
  Dark: "Moon",
  Theme: "SunMoon",
  Colors: "Palette",
  DB: "Database",
  Offline: "WifiOff",
  Computer: "Laptop",
  Desktop: "Monitor",
  Mobile: "Smartphone",
  Print: "Printer",
  Disk: "HardDrive",
  Processor: "Cpu",
  Console: "Terminal",
  Debug: "Bug",
  Flash: "Zap",
  Picture: "Image",
  Gallery: "Images",
  Checkbox: "SquareCheck",
  Text: "Type",
  Quote: "TextQuote",
  H1: "Heading1",
  H2: "Heading2",
  H3: "Heading3",
  Compute: "Calculator",
  Calc: "Calculator",
  Levels: "Layers",
  World: "Globe",
  Earth: "Globe",
  Repair: "Wrench",
  Tool: "Wrench",
  Gear: "Cog",
  Magic: "Sparkles",
  Wand: "Wand2",
  Idea: "Lightbulb",
  Goal: "Target",
  Aim: "Crosshair",
  Pointer: "MousePointer2",
  Cursor: "MousePointer2",
  SignIn: "LogIn",
  SignOut: "LogOut",
} as const;

type InternalAliasName = keyof typeof ICON_ALIASES;

// ============================================
// Mapeos legacy / nombres heredados / español
// ============================================

/**
 * Compatibilidad con nombres legacy o provenientes de otra librería.
 * Las keys deben ir en formato normalizado:
 * - minúsculas
 * - con "_" como separador
 *
 * Ej:
 * `briefcase-business` -> `briefcase_business`
 * `c-briefcase-business` -> `briefcase_business`
 */
const LEGACY_NAME_MAP: Record<string, LucideIconName | InternalAliasName> = {
  // acciones básicas
  suma: "Plus",
  agregar: "Plus",
  aniadir: "Plus",
  restar: "Minus",
  eliminar: "Trash2",
  borrar: "Trash2",
  borrar1: "Trash2",
  trash: "Trash2",
  delete: "Trash2",
  cargar: "Upload",
  descargar: "Download",
  descarga: "Download",
  buscar: "Search",
  lupa: "Search",
  usuario: "User",
  usuarios: "Users",
  documento: "FileText",
  archivo: "File",
  factura: "Receipt",
  guardar: "Save",
  editar: "Edit2",
  editar2: "Edit",
  cheque: "Check",
  ver: "Eye",
  ocultar: "EyeOff",
  alerta: "AlertCircle",
  informacion: "Info",
  calendario: "Calendar",
  camion: "Truck",
  carrito: "ShoppingCart",
  dinero: "DollarSign",
  precio: "DollarSign",
  direccion: "MapPin",
  codigo_qr: "QrCode",
  qr: "QrCode",
  codigo: "Barcode",
  codigo_barras: "Barcode",
  imprimir: "Printer",
  paquete: "Package",
  caja: "Box",

  // compatibilidad puntual que mencionaste
  briefcase_business: "BriefcaseBusiness",

  // legacy adicionales
  x1: "X",
  actualizar: "RefreshCw",
  arriba: "ArrowUp",
  arriba_simple: "ArrowUp",
  arriba_doble: "ChevronUp",
  abajo: "ArrowDown",
  abajo_simple: "ArrowDown",
  abajo_doble: "ChevronDown",
  izquierda: "ArrowLeft",
  izquierda_simple: "ArrowLeft",
  izquierda_doble: "ChevronsLeft",
  derecha: "ArrowRight",
  derecha_simple: "ArrowRight",
  derecha_doble: "ChevronsRight",
  abecedario: "Type",
  arroba: "Mail",
  asignacion: "CheckCircle",
  autorizar: "Shield",
  avion: "Plane",
  ayuda: "HelpCircle",
  banco: "Landmark",
  bandera_derecha: "Flag",
  bandera_derecha_doble: "Flag",
  barco: "Ship",
  bienes: "Package",
  billetera: "Wallet",
  bodega: "Warehouse",
  bolsa_dinero: "ShoppingBag",
  buscar_mapa: "MapPin",
  caja_chica: "Box",
  caja_registradora: "ShoppingCart",
  calcular: "Calculator",
  calendario_actividad: "Calendar",
  calendario_agenda: "CalendarDays",
  calendario_anterior: "ChevronLeft",
  calendario_reloj: "Clock",
  calendario_siguiente: "ChevronRight",
  calendario1: "Calendar",
  camion_reparto: "Truck",
  camion_reparto_lleno: "Truck",
  camion_vacio: "Truck",
  campana: "Bell",
  cancelar: "Ban",
  capas: "Layers",
  carpeta: "Folder",
  carpeta_alerta: "AlertCircle",
  carpeta_buscar: "Search",
  carpeta_descargar: "Download",
  carpeta_eliminar: "Trash2",
  carpeta_mas: "FolderPlus",
  carpeta_menos: "FolderMinus",
  carpetas: "FolderOpen",
  carro: "Car",
  cerrar_sesion: "LogOut",
  chat: "MessageSquare",
  circulo: "Circle",
  circulo_cheque: "CheckCircle",
  circulo_lleno: "CircleDot",
  circulo_x: "XCircle",
  cliente: "User",
  compartir: "Share2",
  configuracion: "Settings",
  contrasena: "Lock",
  control_trafico: "AlertCircle",
  copiar: "Copy",
  cuaderno: "BookmarkPlus",
  cuadrado: "Square",
  cuadrado_cheque: "SquareCheck",
  cuadrado_menos: "Minus",
  dividir: "Columns3",
  dividir_inverso: "Rows3",
  documentacion: "FileCode",
  documentos: "Files",
  empacar: "Box",
  empresa: "Building",
  entregar: "Package",
  error: "AlertCircle",
  estadisticas: "BarChart",
  evaluacion: "TrendingUp",
  excel: "FileSpreadsheet",
  exclamacion: "AlertTriangle",
  femenino: "User",
  grua: "Zap",
  grupo: "Users",
  home: "Home",
  id: "Fingerprint",
  impresora: "Printer",
  impuestos: "DollarSign",
  kanban: "LayoutGrid",
  kpis: "LineChart",
  lapiz: "Edit2",
  lealtad: "Star",
  lealtad1: "Heart",
  link: "Link",
  link_roto: "Unlink",
  lista: "List",
  lista_checkbox: "ListOrdered",
  logistica: "Truck",
  luna: "Moon",
  mail: "Mail",
  mapa_ubicacion: "MapPin",
  masculino: "User",
  memos: "FileText",
  menu: "Menu",
  modulo: "LayoutGrid",
  mundo: "Globe",
  no_encontrado: "AlertCircle",
  no_ver: "EyeOff",
  numeros: "Hash",
  pallet: "Package",
  pantalla_404: "AlertCircle",
  pdf: "FileText",
  pegar: "ClipboardList",
  perfil_usuario: "CircleUser",
  porcentaje: "Percent",
  proceedor: "Building",
  puesto: "Briefcase",
  puerto_derecha: "ArrowRight",
  puerto_izquierda: "ArrowLeft",
  radio_button: "Circle",
  recursos_humanos: "Users",
  reloj: "Clock",
  reportes: "BarChart",
  rol: "Shield",
  sol: "Sun",
  tarifa: "Tag",
  telefono: "Phone",
  ticket: "Receipt",
  trabajador_bodega: "User",
  transferir: "ArrowRightFromLine",
  ubicacion_paquete: "MapPin",
};

// ============================================
// Helpers internos
// ============================================

function isLucideIconName(value: string): value is LucideIconName {
  return value in LucideIcons;
}

function isInternalAliasName(value: string): value is InternalAliasName {
  return value in ICON_ALIASES;
}

function toPascalCase(input: string): string {
  const words = input.split(/[^a-z0-9]+/i).filter(Boolean);
  return words.map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : "")).join("");
}

function normalizeLegacyKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^c-/, "")
    .replace(/[-\s]+/g, "_");
}

function normalizeRawInput(input: string): string {
  return input.trim().replace(/^c-/, "");
}

function resolveAliasOrLucide(name: string): LucideIconName | null {
  if (isLucideIconName(name)) return name;

  if (isInternalAliasName(name)) {
    const aliasTarget = ICON_ALIASES[name];
    if (isLucideIconName(aliasTarget)) return aliasTarget;
  }

  return null;
}

// ============================================
// API pública
// ============================================

/**
 * Devuelve el nombre real del icono de Lucide que corresponde al nombre recibido.
 *
 * Soporta:
 * - nombres reales de Lucide (`BriefcaseBusiness`)
 * - kebab-case (`briefcase-business`)
 * - snake_case (`briefcase_business`)
 * - legacy en español (`camion`, `usuario`, etc.)
 * - aliases internos (`Document`, `Business`, `Notification`, etc.)
 * - nombres con prefijo `c-`
 */
export function resolveIconName(name?: string | null): LucideIconName {
  const fallback: LucideIconName = "FileText";

  if (!name) return fallback;

  const raw = String(name).trim();
  if (!raw) return fallback;

  const direct = resolveAliasOrLucide(raw);
  if (direct) return direct;

  const normalizedRaw = normalizeRawInput(raw);

  const legacyKey = normalizeLegacyKey(raw);
  const legacyMapped = LEGACY_NAME_MAP[legacyKey];
  if (legacyMapped) {
    const resolvedLegacy = resolveAliasOrLucide(legacyMapped);
    if (resolvedLegacy) return resolvedLegacy;
  }

  const pascal = toPascalCase(normalizedRaw);

  const pascalResolved = resolveAliasOrLucide(pascal);
  if (pascalResolved) return pascalResolved;

  const lower = normalizedRaw.toLowerCase();
  const exactInsensitive = Object.keys(LucideIcons).find((key) => key.toLowerCase() === lower);
  if (exactInsensitive && isLucideIconName(exactInsensitive)) return exactInsensitive;

  const partial = Object.keys(LucideIcons).find((key) => key.toLowerCase().includes(lower));
  if (partial && isLucideIconName(partial)) return partial;

  return fallback;
}

/**
 * Obtiene un componente de icono de forma runtime-safe.
 * Nunca devuelve undefined; usa FileText como fallback.
 */
export function getIconForName(name?: string | null): IconComponent {
  const resolved = resolveIconName(name);
  return LucideIcons[resolved] as IconComponent;
}

/**
 * Obtiene un icono por nombre ya resuelto.
 * Útil cuando el nombre ya está tipado.
 */
export function getIcon(name: LucideIconName): IconComponent {
  return LucideIcons[name] as IconComponent;
}

/**
 * Export genérico de los iconos de lucide-react.
 * Sirve para acceso directo si lo necesitas:
 *
 * import { Icons } from "@/lib/icons";
 * const UserIcon = Icons.User;
 */
export const Icons = LucideIcons as unknown as Record<string, IconComponent>;

// ============================================
// Tamaños predefinidos
// ============================================

export const iconSizes = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
  "2xl": "size-10",
} as const;

export type IconSize = keyof typeof iconSizes;

export function getIconClass(size: IconSize = "md", className?: string): string {
  const baseClass = iconSizes[size];
  return className ? `${baseClass} ${className}` : baseClass;
}

// ============================================
// Compatibilidad legacy
// ============================================

/**
 * Alias por compatibilidad con código viejo.
 * @deprecated Usa `Icons` directamente.
 */
export const iconMap = Icons;
