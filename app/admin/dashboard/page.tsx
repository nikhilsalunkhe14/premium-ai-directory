import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from "@/lib/admin-auth";
import { AdminRealtimeProvider } from "@/components/AdminRealtimeProvider";
import { getBlogPosts } from "@/lib/blog-utils";
import { MOCKUP_TOOLS } from "@/lib/mockup-tools";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your AI directory content.",
};

type DashboardStats = {
  totalTools: number;
  totalCategories: number;
  totalBlogPosts: number;
  featuredTools: number;
  recentlyAdded: number;
  pendingSubmissions: number;
};

async function getStats(): Promise<DashboardStats> {
  try {
    const [tools, blogPosts] = await Promise.all([Promise.resolve(MOCKUP_TOOLS), getBlogPosts({ includeDrafts: true, publishedOnly: false })]);

    return {
      totalTools: tools.length,
      totalCategories: 0,
      totalBlogPosts: blogPosts.length,
      featuredTools: tools.filter((tool) => tool.featured).length,
      recentlyAdded: tools.filter((tool) => tool.featured).length,
      pendingSubmissions: 0,
    };
  } catch {
    return {
      totalTools: 0,
      totalCategories: 0,
      totalBlogPosts: 0,
      featuredTools: 0,
      recentlyAdded: 0,
      pendingSubmissions: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionTokenValid(cookieValue)) {
    redirect("/admin");
  }

  const stats = await getStats();

  return (
    <AdminRealtimeProvider>
      <AdminDashboardClient initialStats={stats} />
    </AdminRealtimeProvider>
  );
}
