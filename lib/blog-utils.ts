import { getSupabase, getSupabaseService } from "@/lib/supabase";

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  cover_image?: string;
  thumbnail_image?: string;
  reading_time: number;
  published_at?: string;
  updated_at?: string;
  featured: boolean;
  published: boolean;
  status: "draft" | "published" | "unpublished";
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  og_image?: string;
  twitter_image?: string;
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "fallback-1",
    slug: "best-free-ai-writing-tools-2026",
    title: "10 Best Free AI Writing Tools in 2026",
    excerpt:
      "We tested dozens of AI writing assistants to find the ones that actually deliver. Here are our top picks for bloggers, marketers, and students.",
    content:
      "## Why this matters\n\nThe AI writing landscape has evolved dramatically over the past year. With large language models becoming more capable and accessible, there has never been a better time to leverage AI for your writing tasks.\n\n### Top picks\n\n- ChatGPT for general-purpose drafting\n- Grammarly for editing and tone control\n- Jasper for marketing workflows",
    category: "Writing",
    tags: ["writing", "ai tools", "content"],
    author: "AI Directory Editorial Team",
    reading_time: 6,
    published_at: "2026-07-08T00:00:00.000Z",
    updated_at: "2026-07-09T00:00:00.000Z",
    featured: true,
    published: true,
    status: "published",
  },
  {
    id: "fallback-2",
    slug: "ai-design-tools-for-non-designers",
    title: "AI Design Tools That Make Anyone Look Like a Pro",
    excerpt:
      "You don't need a design degree anymore. These AI tools generate stunning graphics, logos, and presentations from simple text prompts.",
    content:
      "## Design made simple\n\nAI design tools have democratized visual creation. The best platforms now turn prompts into polished templates in minutes.\n\n- Canva for fast visuals\n- Midjourney for artistic concepts\n- Framer AI for full web layouts",
    category: "Design",
    tags: ["design", "ai tools", "graphics"],
    author: "AI Directory Editorial Team",
    reading_time: 5,
    published_at: "2026-07-05T00:00:00.000Z",
    updated_at: "2026-07-06T00:00:00.000Z",
    featured: false,
    published: true,
    status: "published",
  },
];

let fallbackBlogPosts: BlogPost[] = FALLBACK_POSTS.map((post) => ({ ...post }));

function slugify(text: string) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function estimateReadingTime(content: string) {
  const words = String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function normalizeBlogPost(row: Record<string, unknown>): BlogPost {
  const slug = String(row.slug || row.id || "").trim();
  const title = String(row.title || "Untitled Post").trim();
  const content = String(row.content || row.full_content || "");
  return {
    id: String(row.id || slug),
    slug: slug || slugify(title),
    title,
    excerpt: String(row.excerpt || ""),
    content,
    category: String(row.category || "General"),
    tags: normalizeTags(row.tags),
    author: String(row.author || "AI Directory Editorial Team"),
    cover_image: String(row.cover_image || row.coverImage || ""),
    thumbnail_image: String(row.thumbnail_image || row.thumbnailImage || ""),
    reading_time: Number(row.reading_time || estimateReadingTime(content)),
    published_at: String(row.published_at || row.publish_date || ""),
    updated_at: String(row.updated_at || row.updated_date || ""),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    status: String(row.status || (Boolean(row.published) ? "published" : "draft")) as BlogPost["status"],
    seo_title: String(row.seo_title || ""),
    seo_description: String(row.seo_description || ""),
    focus_keyword: String(row.focus_keyword || ""),
    canonical_url: String(row.canonical_url || ""),
    og_image: String(row.og_image || ""),
    twitter_image: String(row.twitter_image || ""),
  };
}

export async function getBlogPosts(options?: { includeDrafts?: boolean; publishedOnly?: boolean }) {
  const publishedOnly = options?.publishedOnly ?? true;
  const includeDrafts = options?.includeDrafts ?? false;

  const supabase = getSupabase();
  if (supabase) {
    let query = supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
    if (publishedOnly && !includeDrafts) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      return data.map((row) => normalizeBlogPost(row as Record<string, unknown>));
    }
  }

  return fallbackBlogPosts
    .filter((post) => (includeDrafts ? true : post.published))
    .map((post) => ({ ...post }));
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
    if (!error && data) {
      return normalizeBlogPost(data as Record<string, unknown>);
    }
  }

  return fallbackBlogPosts.find((post) => post.slug === slug) || null;
}

export async function createBlogPost(input: Partial<BlogPost>) {
  const title = String(input.title || "").trim();
  const slug = String(input.slug || slugify(title) || `post-${Date.now()}`).trim();
  const content = String(input.content || "").trim();
  const published = Boolean(input.published);
  const post: BlogPost = {
    id: input.id || `${Date.now()}`,
    slug,
    title: title || "Untitled Post",
    excerpt: String(input.excerpt || ""),
    content,
    category: String(input.category || "General"),
    tags: normalizeTags(input.tags),
    author: String(input.author || "AI Directory Editorial Team"),
    cover_image: String(input.cover_image || ""),
    thumbnail_image: String(input.thumbnail_image || ""),
    reading_time: Number(input.reading_time || estimateReadingTime(content)),
    published_at: input.published_at || new Date().toISOString(),
    updated_at: input.updated_at || new Date().toISOString(),
    featured: Boolean(input.featured),
    published,
    status: input.status || (published ? "published" : "draft"),
    seo_title: String(input.seo_title || ""),
    seo_description: String(input.seo_description || ""),
    focus_keyword: String(input.focus_keyword || ""),
    canonical_url: String(input.canonical_url || ""),
    og_image: String(input.og_image || ""),
    twitter_image: String(input.twitter_image || ""),
  };

  const serviceSupabase = getSupabaseService();
  if (serviceSupabase) {
    const { error } = await serviceSupabase.from("blog_posts").insert([post]);
    if (!error) {
      return post;
    }
  }

  fallbackBlogPosts = [post, ...fallbackBlogPosts.filter((entry) => entry.slug !== slug)];
  return post;
}

export async function updateBlogPost(idOrSlug: string, input: Partial<BlogPost>) {
  const serviceSupabase = getSupabaseService();
  if (serviceSupabase) {
    const { data, error } = await serviceSupabase
      .from("blog_posts")
      .update(input)
      .eq("id", idOrSlug)
      .or(`slug.eq.${idOrSlug}`)
      .select()
      .maybeSingle();
    if (!error && data) {
      return normalizeBlogPost(data as Record<string, unknown>);
    }
  }

  const existing = fallbackBlogPosts.find((post) => post.id === idOrSlug || post.slug === idOrSlug);
  if (!existing) {
    return null;
  }

  const updated = {
    ...existing,
    ...input,
    slug: input.slug || existing.slug,
    title: input.title || existing.title,
    reading_time: input.reading_time || estimateReadingTime(String(input.content || existing.content)),
    updated_at: new Date().toISOString(),
    published: Boolean(input.published),
    status: input.status || (Boolean(input.published) ? "published" : existing.status),
  } as BlogPost;

  fallbackBlogPosts = fallbackBlogPosts.map((post) => (post.id === idOrSlug || post.slug === idOrSlug ? updated : post));
  return updated;
}

export async function deleteBlogPost(idOrSlug: string) {
  const serviceSupabase = getSupabaseService();
  if (serviceSupabase) {
    const { error } = await serviceSupabase.from("blog_posts").delete().eq("id", idOrSlug).or(`slug.eq.${idOrSlug}`);
    if (!error) {
      return true;
    }
  }

  fallbackBlogPosts = fallbackBlogPosts.filter((post) => post.id !== idOrSlug && post.slug !== idOrSlug);
  return true;
}
