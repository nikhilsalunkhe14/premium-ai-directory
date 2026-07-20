export type AdminFaq = {
  question: string;
  answer: string;
};

export type AdminToolPayload = {
  name: string;
  slug?: string;
  website: string;
  logoUrl?: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  pricing: string;
  tags: string[];
  features: string[];
  pros: string[];
  cons: string[];
  bestUseCases: string[];
  alternatives: string[];
  faq: AdminFaq[];
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  published: boolean;
};

export type AdminBlogPayload = {
  title: string;
  slug?: string;
  coverImageUrl?: string;
  content: string;
  tags: string[];
  author: string;
  publishDate: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type AdminCategoryPayload = {
  name: string;
  slug?: string;
  description: string;
};
