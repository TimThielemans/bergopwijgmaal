import { createServerFn } from "@tanstack/react-start";

export interface AdminSessionInfo {
  email: string;
  createdAt: string;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = (data ?? {}) as { email?: unknown; password?: unknown };
    const email = typeof d.email === "string" ? d.email.slice(0, 200) : "";
    const password = typeof d.password === "string" ? d.password.slice(0, 200) : "";
    if (!email || !password) throw new Error("E-mail en wachtwoord zijn verplicht");
    return { email, password };
  })
  .handler(async ({ data }): Promise<{ ok: true; session: AdminSessionInfo } | { ok: false }> => {
    const { verifyAdmin, adminSession } = await import("./session.server");
    const email = verifyAdmin(data.email, data.password);
    if (!email) return { ok: false };
    const session = await adminSession();
    const createdAt = new Date().toISOString();
    await session.update({ email, createdAt });
    return { ok: true, session: { email, createdAt } };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { adminSession } = await import("./session.server");
  const session = await adminSession();
  await session.clear();
  return { ok: true };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSessionInfo | null> => {
    const { requireAdmin, adminSession } = await import("./session.server");
    try {
      const email = await requireAdmin();
      const session = await adminSession();
      return { email, createdAt: session.data.createdAt ?? new Date().toISOString() };
    } catch {
      return null;
    }
  },
);
