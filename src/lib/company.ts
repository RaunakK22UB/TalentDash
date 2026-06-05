import { Prisma } from '@prisma/client';

export function normalizeCompanyName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    // Remove structural punctuation
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    // Split into words, filter out commercial and country suffixes
    .split(/\s+/)
    .filter(word => {
      const w = word.trim();
      return ![
        'pvt', 'ltd', 'inc', 'llc', 'co', 'com',
        'india', 'usa', 'uk', 'us'
      ].includes(w);
    })
    .join(' ')
    .trim();
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens
}

export async function getOrCreateCompany(
  tx: Prisma.TransactionClient,
  data: {
    name: string;
    industry: string;
    headquarters: string;
    founded_year?: number | null;
    headcount_range?: string | null;
  }
) {
  const normalized = normalizeCompanyName(data.name);
  if (!normalized) {
    throw new Error('Invalid company name');
  }

  // Query by unique normalized_name
  const existing = await tx.company.findUnique({
    where: { normalized_name: normalized },
  });

  if (existing) {
    return existing;
  }

  // Generate unique URL slug
  let slug = generateSlug(normalized);
  
  // Guard against rare duplicate slug conflicts
  const slugExists = await tx.company.findUnique({
    where: { slug },
  });
  if (slugExists) {
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Create new company record
  return await tx.company.create({
    data: {
      name: data.name.trim(),
      slug,
      normalized_name: normalized,
      industry: data.industry.trim(),
      headquarters: data.headquarters.trim(),
      founded_year: data.founded_year,
      headcount_range: data.headcount_range,
    },
  });
}
