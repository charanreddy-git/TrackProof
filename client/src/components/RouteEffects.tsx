import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "TrackProof — Property verification without the travel",
  "/verify": "Request a property visit — TrackProof",
  "/pricing": "Simple pricing — TrackProof",
  "/captain": "Inspect properties near you — TrackProof",
  "/login": "Sign in — TrackProof",
  "/register": "Create your account — TrackProof",
  "/verify/signup": "Request a property visit — TrackProof",
  "/captain/signup": "Join as an inspector — TrackProof",
  "/user": "Your requests — TrackProof",
  "/user/create-task": "Request a visit — TrackProof",
  "/user/tasks": "Your requests — TrackProof",
  "/captain/dashboard": "Find inspection work — TrackProof",
  "/captain/accepted": "Your visits — TrackProof",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/captain/tasks/") && pathname.endsWith("/upload")) return "Submit proof — TrackProof";
  if (pathname.startsWith("/user/tasks/")) return "Visit details — TrackProof";
  if (pathname.startsWith("/user/track/")) return "Live visit tracking — TrackProof";
  if (pathname.startsWith("/captain/tasks/")) return "Visit details — TrackProof";
  return "Page not found — TrackProof";
}

/** Resets scroll on route changes, honours in-page anchors, and keeps tab titles useful. */
export function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.title = getTitle(pathname);

    if (hash) {
      // Wait for the target section to mount before scrolling to it.
      const timer = window.setTimeout(() => {
        const target = document.querySelector(hash);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
