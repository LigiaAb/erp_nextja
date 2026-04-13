import { NextResponse } from "next/server";
import { writeGenericLog, type GenericLogEntry } from "@/lib/logs/buttonLogger";

type RequestBody = {
  fileName?: string;
  entry?: GenericLogEntry;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;

    const eventName = body?.entry?.eventName;
    const moduleName = body?.entry?.module;

    if (typeof eventName !== "string" || eventName.trim() === "" || !moduleName) {
      return NextResponse.json({ message: "eventName y module son requeridos" }, { status: 400 });
    }

    await writeGenericLog(body.entry, body.fileName);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar el log";
    return NextResponse.json({ message }, { status: 500 });
  }
}

