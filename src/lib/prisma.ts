import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Create or reuse pg connection pool
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

// Dynamically resolve schema from database connection string or default to 'public'
let schemaName = 'public';
try {
  const urlObj = new URL(process.env.DATABASE_URL || '');
  const schemaParam = urlObj.searchParams.get('schema');
  if (schemaParam) {
    schemaName = schemaParam;
  }
} catch (e) {
  // Fallback to public
}

// Set up driver adapter for PostgreSQL with dynamic schema configuration
const adapter = new PrismaPg(pool, {
  schema: schemaName,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
