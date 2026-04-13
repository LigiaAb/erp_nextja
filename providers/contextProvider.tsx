"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setcontext } from "@/store/context/contextSlice";
import { setCurrentCategoria, setCurrentMenu, setCurrentModulo, setCurrentModuloName } from "@/store/navigation/navigationSlice";

type Props = {
  children: React.ReactNode;

  /**
   * requireCtx=true  -> (dashboard) si NO hay ctx => redirect a /context
   * requireCtx=false -> (context)  si SÍ hay ctx => redirect a /dashboard
   */
  requireCtx?: boolean;

  redirectIfMissing?: string; // "/context"
  redirectIfPresent?: string; // "/dashboard"
};

type CtxState = "unknown" | "has" | "missing";

const TAB_KEY = "ctx"; // override por pestaña (sessionStorage)
const GLOBAL_KEY = "ctx_default"; // default global (localStorage)

function getCtxStateClient(): CtxState {
  try {
    const tab = sessionStorage.getItem(TAB_KEY);
    if (tab) return "has";

    const global = localStorage.getItem(GLOBAL_KEY);
    if (global) return "has";

    return "missing";
  } catch {
    return "missing";
  }
}

function getCtxStateServer(): CtxState {
  return "unknown";
}

export default function ContextGate({ children, requireCtx = true, redirectIfMissing = "/context", redirectIfPresent = "/dashboard" }: Props) {
  const router = useRouter();

  const ctxState = useSyncExternalStore(
    // Nos basta snapshot en render; devolvemos unsubscribe válido.
    () => () => {},
    getCtxStateClient,
    getCtxStateServer,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const men = sessionStorage.getItem("currentMenu");
      const mod = sessionStorage.getItem("currentModulo");
      const modN = sessionStorage.getItem("currentModuloName");
      const cat = sessionStorage.getItem("currentCategoria");

      if (!!mod) dispatch(setCurrentModulo(Number(mod)));
      if (!!modN) dispatch(setCurrentModuloName(modN));
      if (!!men) dispatch(setCurrentMenu(Number(men)));
      if (!!cat) dispatch(setCurrentCategoria(Number(cat)));
    } catch {
      // ignorar
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ctx") ?? localStorage.getItem("ctx_default");

      if (!raw) return;

      const ctx = JSON.parse(raw);

      dispatch(setcontext(ctx));
    } catch {
      // ignorar
    }
  }, [dispatch]);

  useEffect(() => {
    if (ctxState === "unknown") return;

    if (requireCtx && ctxState === "missing") {
      router.replace(redirectIfMissing);
      return;
    }

    if (!requireCtx && ctxState === "has") {
      router.replace(redirectIfPresent);
    }
  }, [ctxState, requireCtx, redirectIfMissing, redirectIfPresent, router]);

  if (ctxState === "unknown") return null;

  if (requireCtx && ctxState !== "has") return null;
  if (!requireCtx && ctxState !== "missing") return null;

  return <>{children}</>;
}
