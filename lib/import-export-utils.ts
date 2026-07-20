type ImportRow = Record<string, string | undefined>;

export type ImportToolPayload = {
  slug: string;
  name: string;
  category: string;
  pricing_type: string;
  description: string;
  tool_url: string;
  logo_url?: string;
  tags?: string[];
  features?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  faq?: Array<{ question: string; answer: string }>;
  seo_title?: string;
  seo_description?: string;
  featured?: boolean;
  published?: boolean;
};

export type ParsedImportFile = {
  headers: string[];
  rows: ImportRow[];
};

function slugify(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function splitList(value: string | undefined) {
  if (!value) return [];
  return value
    .split(/\||,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value: string | undefined) {
  if (!value) return false;
  const normalized = value.toLowerCase();
  if (["true", "1", "yes", "y", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "off"].includes(normalized)) return false;
  return Boolean(normalized);
}

function parseFaq(value: string | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({ question: String(item?.question ?? "").trim(), answer: String(item?.answer ?? "").trim() }))
        .filter((item) => item.question && item.answer);
    }
  } catch {
    // fall back to simple string entries
  }
  return [];
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function detectField(headers: string[], candidates: string[]) {
  const normalized = headers.map((header) => header.toLowerCase().trim());
  const match = normalized.find((header) => candidates.includes(header));
  return match ? headers[normalized.indexOf(match)] : undefined;
}

export function autoMapColumns(headers: string[]) {
  const normalizedHeaders = headers.map((header) => header.toLowerCase().trim());
  return {
    name: detectField(headers, ["name", "tool_name", "tool", "title"]),
    slug: detectField(headers, ["slug", "handle", "url_slug"]),
    website: detectField(headers, ["website", "url", "website_url", "link", "tool_url"]),
    logo: detectField(headers, ["logo", "logo_url", "image", "image_url"]),
    category: detectField(headers, ["category", "category_name"]),
    pricing: detectField(headers, ["pricing", "pricing_type", "plan"]),
    description: detectField(headers, ["description", "short_description", "summary"]),
    tags: detectField(headers, ["tags", "keywords", "tag_list"]),
    features: detectField(headers, ["features", "highlights"]),
    pros: detectField(headers, ["pros", "advantages"]),
    cons: detectField(headers, ["cons", "disadvantages"]),
    alternatives: detectField(headers, ["alternatives", "similar_tools"]),
    faq: detectField(headers, ["faq", "faq_data"]),
    seo_title: detectField(headers, ["seo_title", "meta_title"]),
    seo_description: detectField(headers, ["seo_description", "meta_description"]),
    featured: detectField(headers, ["featured", "is_featured"]),
    published: detectField(headers, ["published", "is_published"]),
  };
}

export function parseCsv(text: string): ParsedImportFile {
  const rows: string[][] = [];
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let current: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  const pushField = () => {
    current.push(currentValue);
    currentValue = "";
  };

  const pushRow = () => {
    if (current.length > 0 || currentValue.length > 0) {
      rows.push(current);
      current = [];
      currentValue = "";
    }
  };

  for (const line of lines) {
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"') {
        if (inQuotes && line[index + 1] === '"') {
          currentValue += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        pushField();
      } else if (char === "\n") {
        pushField();
        pushRow();
      } else {
        currentValue += char;
      }
    }
    if (!inQuotes) {
      pushField();
      pushRow();
    }
  }

  if (inQuotes) {
    pushField();
    pushRow();
  }

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map((header) => header.trim());
  const dataRows = rows.slice(1).map((row) => {
    const record: ImportRow = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    return record;
  });

  return { headers, rows: dataRows };
}

export function parseImportText(format: string, text: string): ParsedImportFile {
  if (format === "json") {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return {
        headers: Object.keys(parsed[0] ?? {}),
        rows: (parsed as ImportRow[]).map((row) => row),
      };
    }
    if (parsed && typeof parsed === "object") {
      return { headers: Object.keys(parsed as Record<string, unknown>), rows: [parsed as ImportRow] };
    }
  }

  return parseCsv(text);
}

export function buildImportPayload(rawRow: ImportRow, fieldMap: ReturnType<typeof autoMapColumns>) {
  const payload: ImportToolPayload = {
    slug: slugify(normalizeValue(rawRow[fieldMap.slug as string] ?? rawRow.slug ?? rawRow.Slug)),
    name: normalizeValue(rawRow[fieldMap.name as string] ?? rawRow.name ?? rawRow.Name),
    category: normalizeValue(rawRow[fieldMap.category as string] ?? rawRow.category ?? rawRow.Category),
    pricing_type: normalizeValue(rawRow[fieldMap.pricing as string] ?? rawRow.pricing ?? rawRow.Pricing),
    description: normalizeValue(rawRow[fieldMap.description as string] ?? rawRow.description ?? rawRow.Description),
    tool_url: normalizeValue(rawRow[fieldMap.website as string] ?? rawRow.website ?? rawRow.Website),
    logo_url: normalizeValue(rawRow[fieldMap.logo as string] ?? rawRow.logo ?? rawRow.Logo),
    tags: splitList(normalizeValue(rawRow[fieldMap.tags as string] ?? rawRow.tags ?? rawRow.Tags)),
    features: splitList(normalizeValue(rawRow[fieldMap.features as string] ?? rawRow.features ?? rawRow.Features)),
    pros: splitList(normalizeValue(rawRow[fieldMap.pros as string] ?? rawRow.pros ?? rawRow.Pros)),
    cons: splitList(normalizeValue(rawRow[fieldMap.cons as string] ?? rawRow.cons ?? rawRow.Cons)),
    alternatives: splitList(normalizeValue(rawRow[fieldMap.alternatives as string] ?? rawRow.alternatives ?? rawRow.Alternatives)),
    faq: parseFaq(normalizeValue(rawRow[fieldMap.faq as string] ?? rawRow.faq ?? rawRow.FAQ)),
    seo_title: normalizeValue(rawRow[fieldMap.seo_title as string] ?? rawRow.seo_title ?? rawRow.SeoTitle),
    seo_description: normalizeValue(rawRow[fieldMap.seo_description as string] ?? rawRow.seo_description ?? rawRow.SeoDescription),
    featured: parseBoolean(normalizeValue(rawRow[fieldMap.featured as string] ?? rawRow.featured ?? rawRow.Featured)),
    published: parseBoolean(normalizeValue(rawRow[fieldMap.published as string] ?? rawRow.published ?? rawRow.Published)),
  };

  if (!payload.slug && payload.name) {
    payload.slug = slugify(payload.name);
  }

  return payload;
}

export function validateImportRow(payload: ImportToolPayload, existingSlugs: Set<string>, existingWebsites: Set<string>, batchSlugs: Set<string>, batchWebsites: Set<string>) {
  const errors: string[] = [];

  if (!payload.name) errors.push("Missing tool name.");
  if (!payload.category) errors.push("Missing category.");
  if (!payload.pricing_type) errors.push("Missing pricing.");
  if (!payload.description) errors.push("Missing description.");
  if (!payload.tool_url) errors.push("Missing website URL.");
  if (payload.tool_url && !isValidUrl(payload.tool_url)) errors.push("Invalid website URL.");
  if (payload.logo_url && !isValidUrl(payload.logo_url)) errors.push("Invalid logo URL.");
  if (!payload.slug) errors.push("Missing slug.");

  if (payload.slug && (existingSlugs.has(payload.slug) || batchSlugs.has(payload.slug))) {
    errors.push(`Duplicate slug: ${payload.slug}`);
  }
  if (payload.tool_url && (existingWebsites.has(payload.tool_url) || batchWebsites.has(payload.tool_url))) {
    errors.push(`Duplicate website: ${payload.tool_url}`);
  }

  return { errors, payload };
}

export function buildCsvExport(rows: Array<Record<string, unknown>>) {
  const headers = ["name", "slug", "website", "category", "pricing", "description", "tags", "featured", "published"];
  const lines = [headers.join(",")];
  for (const row of rows) {
    const values = headers.map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`);
    lines.push(values.join(","));
  }
  return lines.join("\n");
}

export function buildJsonExport(rows: Array<Record<string, unknown>>) {
  return JSON.stringify(rows, null, 2);
}
