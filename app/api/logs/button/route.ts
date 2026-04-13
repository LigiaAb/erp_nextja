import { NextResponse } from "next/server";
import { writeButtonLog, type ButtonLogEntry } from "@/lib/logs/buttonLogger";

type RequestBody = {
  fileName?: string;
  entry?: ButtonLogEntry;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;

    if (!body?.entry?.buttonId || !body?.entry?.module) {
      return NextResponse.json({ message: "buttonId y module son requeridos" }, { status: 400 });
    }

    await writeButtonLog(body.entry, body.fileName);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar el log";
    return NextResponse.json({ message }, { status: 500 });
  }
}
