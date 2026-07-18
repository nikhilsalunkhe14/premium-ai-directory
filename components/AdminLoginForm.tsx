"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/admin/submissions";
        return;
      }

      const json = await res.json();
      setError(json?.message || "Invalid credentials.");
    } catch (err) {
      setError("Unable to sign in. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
      <div className="mb-6 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin Login</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Secure access required</h1>
      </div>

      <label className="block text-sm font-medium text-slate-700">Admin Password</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        placeholder="Enter admin password"
        autoComplete="current-password"
        required
      />

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
