"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { PermisosUsuarios, PermisosCentroCosto } from "@/types/permisos/permisos";
import { selectPermisos, setPermisos } from "@/store/permisos/permisosSlice";
import { selectAuth, setUserData } from "@/store/auth/authSlice";
import { DetResEmpUsuPuesto } from "@/types/auth/login";

type Ctx = { paisId: string; empresaId: string; centroCostoId: string };

type PermissionsState = {
  ctx: Ctx | null;
  permisosUsuarios: PermisosUsuarios | null;
  permisosCC: PermisosCentroCosto | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const PermissionsContext = createContext<PermissionsState | null>(null);

function resolveCodUsuario(authCodUsuario: number | null): string | null {
  const fromLocalStorage = localStorage.getItem("cod_usuario");
  if (fromLocalStorage) return fromLocalStorage;

  if (authCodUsuario !== null && authCodUsuario !== undefined) {
    return String(authCodUsuario);
  }

  return null;
}

function readCtx(): Ctx | null {
  try {
    const raw = sessionStorage.getItem("ctx") ?? localStorage.getItem("ctx_default");
    return raw ? (JSON.parse(raw) as Ctx) : null;
  } catch {
    return null;
  }
}

function getPermisosCC(permisosUsuarios: PermisosUsuarios | null, ctx: Ctx | null): PermisosCentroCosto | null {
  if (!permisosUsuarios || !ctx) return null;

  const pKey = String(ctx.paisId);
  const eKey = String(ctx.empresaId);
  const cKey = String(ctx.centroCostoId);

  return permisosUsuarios.permisos?.paises?.[pKey]?.empresas?.[eKey]?.centrosCosto?.[cKey] ?? null;
}

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const permisosUsuarios = useSelector(selectPermisos);
  const userAuth = useSelector(selectAuth);

  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setCtx(readCtx());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPermisosUsuarios() {
      if (permisosUsuarios) return;

      setLoading(true);
      setError(null);

      try {
        const cod_usuario = resolveCodUsuario(userAuth.cod_usuario);
        if (!cod_usuario) return;

        const res = await fetch(`/api/permisos?cod_usuario=${encodeURIComponent(cod_usuario)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.message ?? "No se pudieron cargar permisos");
        }

        const payload = (await res.json()) as { json: PermisosUsuarios };
        if (!payload?.json) throw new Error("Respuesta inválida (json faltante)");

        if (!cancelled) dispatch(setPermisos(payload.json));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error cargando permisos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadUserInformation() {
      if (userAuth.cod_usuario) return;

      setLoading(true);
      setError(null);

      try {
        const cod_usuario = resolveCodUsuario(userAuth.cod_usuario);
        if (!cod_usuario) return;

        const res = await fetch(`/api/user?cod_usuario=${encodeURIComponent(cod_usuario)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.message ?? "No se pudieron cargar permisos");
        }

        const payload = (await res.json()) as { json: DetResEmpUsuPuesto[] };
        if (!payload?.json) throw new Error("Respuesta inválida (json faltante)");

        if (!cancelled) {
          const user = payload.json;

          dispatch(
            setUserData({
              cod_usuario: Number(cod_usuario),
              nombre_completo: `${user[0].NOM_EMPLEADO} ${user[0].APELLIDO_EMP}`,
              nombre: user[0].NOM_EMPLEADO,
              apellido: user[0].APELLIDO_EMP,
              correo: user[0].USUARIO,
              puesto: "",
            }),
          );
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error cargando permisos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    Promise.all([loadPermisosUsuarios(), loadUserInformation()]);
    return () => {
      cancelled = true;
    };
  }, [dispatch, permisosUsuarios, userAuth.cod_usuario, nonce]);

  const permisosCC = useMemo(() => getPermisosCC(permisosUsuarios, ctx), [permisosUsuarios, ctx]);

  const value = useMemo<PermissionsState>(
    () => ({
      ctx,
      permisosUsuarios,
      permisosCC,
      loading,
      error,
      refresh: () => {
        setCtx(readCtx());
        setNonce((n) => n + 1);
      },
    }),
    [ctx, permisosUsuarios, permisosCC, loading, error],
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const v = useContext(PermissionsContext);
  if (!v) throw new Error("usePermissions debe usarse dentro de PermissionsProvider");
  return v;
}
