"use client";

import { useState } from "react";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error("logout failed", e);
    } finally {
      // redirect to login page
      window.location.href = "/admin";
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
    >
      {loading ? "Signing out…" : "Logout"}
    </button>
  );
}
