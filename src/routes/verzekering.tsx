import { createFileRoute, redirect } from "@tanstack/react-router";

/** Oude URL blijft werken. */
export const Route = createFileRoute("/verzekering")({
  beforeLoad: () => {
    throw redirect({ to: "/praktisch/verzekering", statusCode: 301 });
  },
});
