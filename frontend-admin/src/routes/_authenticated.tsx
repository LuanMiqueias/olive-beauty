import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/shared/components/layout/AdminLayout";

// Simple global lock to prevent concurrent beforeLoad executions
let authCheckPromise: Promise<void> | null = null;
let lastAuthCheckTime = 0;
const AUTH_CHECK_COOLDOWN = 2000; // 2 seconds cooldown

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    console.log(
      "[beforeLoad] Called at",
      new Date().toISOString(),
      "Path:",
      window.location.pathname
    );
    const token = localStorage.getItem("token");

    // No token = redirect immediately
    if (!token) {
      authCheckPromise = null;
      throw redirect({
        to: "/login",
        search: { error: undefined },
      });
    }

    // Import store
    const { useAuthStore } = await import("@/shared/stores");
    const store = useAuthStore.getState();

    // If user is already loaded and authenticated, skip
    if (
      store.user &&
      store.isAuthenticated &&
      store.isAdmin &&
      store.token === token
    ) {
      return;
    }

    // If there's a pending auth check, wait for it
    if (authCheckPromise) {
      console.log("[beforeLoad] Waiting for pending auth check");
      try {
        await authCheckPromise;
        console.log("[beforeLoad] Pending auth check completed");
        // After waiting, verify state again
        const currentStore = useAuthStore.getState();
        if (
          currentStore.user &&
          currentStore.isAuthenticated &&
          currentStore.isAdmin &&
          currentStore.token === token
        ) {
          return;
        }
      } catch {
        // If promise failed, we'll try again below
      }
    }

    // Cooldown check - prevent rapid successive calls
    const now = Date.now();
    if (now - lastAuthCheckTime < AUTH_CHECK_COOLDOWN && authCheckPromise) {
      try {
        await authCheckPromise;
        return;
      } catch {
        // Continue to fetch if promise failed
      }
    }

    // Only fetch if we don't have user data and not currently loading
    if (!store.user && !store.isLoading) {
      console.log("[beforeLoad] Starting getCurrentUser");
      lastAuthCheckTime = now;

      // Create the promise and store reference
      let promiseRef: Promise<void> | null = null;
      promiseRef = (async () => {
        try {
          console.log("[beforeLoad] Calling getCurrentUser API");
          await store.getCurrentUser();
          console.log("[beforeLoad] getCurrentUser success");
        } catch (error) {
          // On error, clear promise and redirect
          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && !currentPath.startsWith("/login")) {
            localStorage.removeItem("token");
            store.logout();
            throw redirect({
              to: "/login",
              search: {
                error: undefined,
              },
            });
          }
          throw error;
        } finally {
          // Clear promise after completion (success or failure)
          // Only clear if this is still the current promise
          if (authCheckPromise === promiseRef) {
            authCheckPromise = null;
          }
        }
      })();

      authCheckPromise = promiseRef;

      await promiseRef;
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  // Simply render the layout - beforeLoad handles all authentication checks
  // This prevents any re-render loops from store subscriptions
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
