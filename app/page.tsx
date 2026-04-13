import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const store = await cookies();

  const hasSession = !!store.get("session");
  const hasContext = !!store.get("ctx");

  if (!hasSession) redirect("/login");
  if (!hasContext) redirect("/context");

  redirect("/dashboard");
}
