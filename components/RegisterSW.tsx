"use client";

import { useEffect, useState } from "react";

export function RegisterSW() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failure is non-fatal; the form still works without a SW.
    });

    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 border-b border-flare/40 bg-flare/15 px-4 py-2 text-center text-xs text-flare"
    >
      You&apos;re offline. Your draft will stay on this page — submit again
      when you reconnect.
    </div>
  );
}
