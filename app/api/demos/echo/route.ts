import { NextResponse } from "next/server";

type RequestBody = {
  nombre?: string;
  activo?: boolean;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null;

  return NextResponse.json({
    success: true,
    data: {
      ok: true,
      receivedAt: new Date().toISOString(),
      payload: body,
    },
  });
}

