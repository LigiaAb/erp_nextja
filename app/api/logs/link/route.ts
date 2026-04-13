import { NextResponse } from "next/server";
import { writeButtonLog } from "@/lib/logs/buttonLogger";

function resolveSafeTarget(to: string | null) {
  if (!to) return "/dashboard";

  // Solo permitimos rutas internas.
  if (to.startsWith("/") && !to.startsWith("//")) {
    return to;
  }

  return "/dashboard";
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);

  const to = resolveSafeTarget(searchParams.get("to"));
  const buttonId = searchParams.get("buttonId");
  const moduleName = searchParams.get("module");
  const label = searchParams.get("label") ?? undefined;
  const fileName = searchParams.get("fileName") ?? undefined;
  const cod_usuario = searchParams.get("cod_usuario") ?? undefined;

  if (!buttonId || !moduleName) {
    return NextResponse.redirect(new URL(to, origin));
  }

  try {
    await writeButtonLog(
      {
        buttonId,
        module: moduleName,
        label,
        route: to,
        cod_usuario,
      },
      fileName,
    );
  } catch {
    // Si falla el log, no bloqueamos navegación.
  }

  return NextResponse.redirect(new URL(to, origin));
}
