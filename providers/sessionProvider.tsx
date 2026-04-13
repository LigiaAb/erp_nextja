"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { runClientLogoutFlow } from "@/lib/auth/clientLogout";
import { selectSession, setSessionExpired } from "@/store/session/sessionSlice";
import type { AppDispatch } from "@/store";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SessionProviderProps = {
  children: React.ReactNode;
};

function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const parts = document.cookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }

  return null;
}

function deleteClientCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();

  const sessionExpired = useSelector(selectSession);

  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    function syncSessionExpiredFlag() {
      const expiredFlag = getClientCookie("session_expired");

      if (expiredFlag === "1") {
        dispatch(setSessionExpired());

        // La cookie ya cumplió su función: Redux se queda con el estado reactivo.
        deleteClientCookie("session_expired");
      }
    }

    syncSessionExpiredFlag();

    const interval = window.setInterval(syncSessionExpiredFlag, 1000);

    const handleFocus = () => syncSessionExpiredFlag();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncSessionExpiredFlag();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dispatch]);

  async function handleConfirmLogout() {
    if (submitting) return;
    setSubmitting(true);

    try {
      await runClientLogoutFlow({
        dispatch,
        router,
        redirectTo: "/",
        pathname,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {children}

      <Dialog open={sessionExpired}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Sesión vencida</DialogTitle>
            <DialogDescription>Tu sesión ha vencido. Debes volver a iniciar sesión para continuar.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={handleConfirmLogout} disabled={submitting}>
              iniciar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
