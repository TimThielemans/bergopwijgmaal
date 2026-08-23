import { createServerFn } from "@tanstack/react-start";
import type { RefreshResult, VolleyDataStatus } from "./types";

/**
 * Server functions for the admin page. All work happens in the server-only
 * runner (`refresh.server.ts`), imported inside the handler so nothing
 * server-only can leak into the client bundle.
 */

export const refreshVolleyData = createServerFn({ method: "POST" }).handler(
  async (): Promise<RefreshResult> => {
    const { runVolleyDataRefresh } = await import("./refresh.server");
    return runVolleyDataRefresh();
  },
);

export const getVolleyDataStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<VolleyDataStatus> => {
    const { readVolleyDataStatus } = await import("./refresh.server");
    return readVolleyDataStatus();
  },
);
