import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminNav() {
  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Tools", href: "/admin/tools" },
    { label: "Blog", href: "/admin/blog" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Submissions", href: "/admin/submissions" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Import / Export", href: "/admin/import-export" },
  ];

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-slate-950/95 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/dashboard" className="text-lg font-semibold text-white">
            AI Directory Admin
          </Link>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300 md:inline-flex">
            Protected
          </span>
          <AdminLogoutButton />
        </div>
      </div>
    </div>
  );
}
