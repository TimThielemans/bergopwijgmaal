import { defineCliConfig } from "sanity/cli";

/** CLI config for `sanity deploy` — keeps the hosted Studio host stable. */
export default defineCliConfig({
  api: { projectId: "utlbxtd6", dataset: "production" },
  studioHost: "bergop-wijgmaal",
});
