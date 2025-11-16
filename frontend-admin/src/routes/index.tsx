import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem("token");
    if (token) {
      // Try to redirect to dashboard
      throw redirect({
        to: "/dashboard",
      });
    }
    // Otherwise redirect to login
    throw redirect({
      to: "/login",
      search: { error: undefined },
    });
  },
});
