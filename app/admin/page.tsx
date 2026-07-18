import AdminLoginForm from "@/components/AdminLoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to access the admin dashboard.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="mx-auto max-w-2xl px-4">
        <AdminLoginForm />
      </div>
    </div>
  );
}
