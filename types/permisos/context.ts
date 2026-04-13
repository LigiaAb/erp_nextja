import React from "react";
import { StepValue } from "../components/stepper";

export type CtxValuePais = { cod_pais: number; nombre_pais: string };
export type CtxValueEmpresa = { cod_empresa: number; nombre_emp: string };
export type CtxValueCC = { cod_cc: number; nombre_cc: string };
export type Ctx = {
  paisId?: CtxValuePais;
  empresaId?: CtxValueEmpresa;
  centroCostoId?: CtxValueCC;
};

/**
 * Props del componente principal.
 */
export interface ContextFormProps {
  onDone?: () => void;
}

/**
 * Definición base de los steps.
 * Se usa con `as const` en el componente para inferir literals.
 */
export type StepDefItem = {
  value: number;
  icon: React.ReactNode;
  title: string;
};

/**
 * Entry genérico para construir configuraciones tipadas
 * de país / empresa / centro de costo.
 */
export type EntryConfig<T, TStep extends number> = {
  label?: string;
  options?: T[];
  getKey: (p: T) => React.Key;
  getLabel: (p: T) => React.ReactNode;
  isSelected: (p: T) => boolean;
  onSelect: (p: T) => void;
  nextStep?: TStep;
  bandera?: (p: T, w?: number) => React.ReactNode;
};

/**
 * Versión unificada para render genérico.
 * Aquí ya perdemos el tipo real del item y trabajamos con unknown.
 * Eso permite no hacer switch al renderizar.
 */
export type CatalogoEntry<TStep extends number> = {
  label?: string;
  options?: unknown[];
  getKey: (p: unknown) => React.Key;
  getLabel: (p: unknown) => React.ReactNode;
  isSelected: (p: unknown) => boolean;
  onSelect: (p: unknown) => void;
  nextStep?: TStep;
  bandera?: (p: unknown, w?: number) => React.ReactNode;
};

/**
 * Builder:
 * recibe funciones tipadas con T real,
 * pero retorna una versión "unificada" para el render.
 */
export function entry<T, TStep extends number>(e: EntryConfig<T, TStep>): CatalogoEntry<TStep> {
  return e as unknown as CatalogoEntry<TStep>;
}

/**
 * Type guard para validar StepValue del Stepper
 * contra una lista fija de steps numéricos.
 */
export function isStepValueInList<TStep extends number>(v: StepValue, allowed: readonly TStep[]): v is TStep {
  return allowed.includes(Number(v) as TStep);
}
