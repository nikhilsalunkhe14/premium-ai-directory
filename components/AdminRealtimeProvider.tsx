"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";

type ConnectionStatus = "CONNECTING" | "SUBSCRIBED" | "TIMED_OUT" | "CHANNEL_ERROR" | "CLOSED";

type RealtimeEvent = {
  table: string;
  eventType: string;
  message: string;
  payload?: Record<string, unknown>;
};

type ToastMessage = {
  id: number;
  message: string;
  tone: "success" | "info";
};

type AdminRealtimeContextValue = {
  toasts: ToastMessage[];
  latestEvent: RealtimeEvent | null;
  refreshVersion: number;
  connectionStatus: ConnectionStatus;
  pushToast: (message: string, tone?: ToastMessage["tone"]) => void;
};

const AdminRealtimeContext = createContext<AdminRealtimeContextValue | null>(null);

function buildMessage(table: string, eventType: string, payload?: Record<string, unknown>) {
  if (table === "tools") {
    if (eventType === "INSERT") return "Tool added.";
    if (eventType === "UPDATE") {
      const next = payload?.new as Record<string, unknown> | undefined;
      if (next?.published) return "Tool published.";
      if (next?.featured) return "Tool featured.";
      return "Tool updated.";
    }
    if (eventType === "DELETE") return "Tool deleted.";
  }

  if (table === "blog_posts") {
    if (eventType === "INSERT") return "Blog added.";
    if (eventType === "UPDATE") return "Blog updated.";
    if (eventType === "DELETE") return "Blog deleted.";
  }

  if (table === "categories") {
    if (eventType === "INSERT") return "Category added.";
    if (eventType === "UPDATE") return "Category updated.";
    if (eventType === "DELETE") return "Category deleted.";
  }

  if (table === "tool_submissions") {
    if (eventType === "INSERT") return "Submission received.";
    if (eventType === "UPDATE") return "Submission updated.";
  }

  return "Directory updated.";
}

export function AdminRealtimeProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [latestEvent, setLatestEvent] = useState<RealtimeEvent | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("CONNECTING");

  const pushToast = (message: string, tone: ToastMessage["tone"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }].slice(-4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  };

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setConnectionStatus("CHANNEL_ERROR");
      pushToast("Realtime unavailable. Check Supabase environment variables.", "info");
      return;
    }

    const channel = supabase.channel("admin-realtime", {
      config: {
        broadcast: { self: false },
        presence: { key: "admin" },
      },
    });

    channel.on("postgres_changes", { event: "*", schema: "public", table: "*" }, (payload) => {
      const table = String(payload?.table ?? "");
      if (!table) return;
      const allowedTables = new Set(["tools", "tool_submissions", "blog_posts", "categories"]);
      if (!allowedTables.has(table)) return;

      const eventType = String(payload.eventType ?? "UPDATE");
      const message = buildMessage(table, eventType, payload as Record<string, unknown>);
      setLatestEvent({ table, eventType, message, payload: payload as Record<string, unknown> });
      setRefreshVersion((current) => current + 1);
      pushToast(message, "success");
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setConnectionStatus("SUBSCRIBED");
      } else if (status === "CHANNEL_ERROR") {
        setConnectionStatus("CHANNEL_ERROR");
      } else if (status === "TIMED_OUT") {
        setConnectionStatus("TIMED_OUT");
      } else if (status === "CLOSED") {
        setConnectionStatus("CLOSED");
      } else {
        setConnectionStatus("CONNECTING");
      }
    });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const value = useMemo<AdminRealtimeContextValue>(
    () => ({
      toasts,
      latestEvent,
      refreshVersion,
      connectionStatus,
      pushToast,
    }),
    [toasts, latestEvent, refreshVersion, connectionStatus]
  );

  return (
    <AdminRealtimeContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-lg ${
              toast.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-900 text-slate-100"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </AdminRealtimeContext.Provider>
  );
}

export function useAdminRealtime() {
  const context = useContext(AdminRealtimeContext);
  if (!context) {
    throw new Error("useAdminRealtime must be used within AdminRealtimeProvider");
  }

  return context;
}
