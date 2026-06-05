import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Enable Incremental Static Regeneration (ISR) to cache query results for 1 hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch database metrics and two real salary IDs for comparison concurrently
  const [totalCompanies, totalSalaries, seededSalaries] = await Promise.all([
    prisma.company.count(),
    prisma.salary.count(),
    prisma.salary.findMany({
      take: 2,
      select: { id: true },
    }),
  ]);

  // Construct comparison URL dynamically with real database IDs
  const s1 = seededSalaries[0]?.id || '00000000-0000-0000-0000-000000000000';
  const s2 = seededSalaries[1]?.id || '00000000-0000-0000-0000-000000000000';
  const compareUrl = `/api/compare?s1=${s1}&s2=${s2}`;

  return (
    <div className="min-h-screen bg-brand-background px-6 py-12 md:px-12 flex flex-col items-center font-sans antialiased text-brand-body">
      
      {/* Container holding the dashboard */}
      <div className="w-full max-w-5xl space-y-10">
        
        {/* ======================================================
            HEADER SECTION (Centered, Extra Large Title)
           ====================================================== */}
        <header className="flex flex-col items-center text-center pb-2 gap-4">
          {/* Database Live Connectivity Banner */}
          <div className="flex items-center space-x-3 bg-brand-surface border border-brand-border px-4 py-2 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-pulse"></span>
            <span className="text-xs font-bold text-brand-deep uppercase tracking-wider">Database Node Online — Neon Serverless PostgreSQL</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">TalentDash API Console</span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-brand-deep leading-tight">
              Backend Testing Endpoints
            </h1>
            <p className="text-sm font-semibold text-brand-muted mt-2">
              Note: Use Postman, cURL, or a REST client to test the POST payload validation and deduplication endpoints.
            </p>
          </div>
        </header>

        {/* ======================================================
            METRICS DASHBOARD BANNER
           ====================================================== */}
        <section className="bg-brand-surface border border-brand-border p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border shadow-sm">
          {/* Card 1 */}
          <div className="pb-6 sm:pb-0 sm:pr-8 flex items-center space-x-4">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-brand-deep tracking-tight block">{totalCompanies}</span>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Verified Corporate Entities</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="pt-6 sm:pt-0 sm:pl-8 flex items-center space-x-4">
            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 6h4" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-brand-deep tracking-tight block">{totalSalaries}</span>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Ingested Salary Records</p>
            </div>
          </div>
        </section>

        {/* ======================================================
            INTERACTIVE ENDPOINTS CARDS GRID (100% Unique Design)
           ====================================================== */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-brand-deep uppercase tracking-wider">Verification Suite</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Seed Check */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-success/15 text-brand-success uppercase tracking-wider border border-brand-success/20">GET</span>
                  <span className="text-xs text-brand-muted font-medium">Seed Check</span>
                </div>
                <h3 className="font-mono text-sm font-bold text-brand-deep break-all">/api/salaries?limit=5</h3>
                <p className="text-xs text-brand-body leading-relaxed">
                  Validates live Neon PostgreSQL connection string pools, seeding integrity, and structural pagination metadata formatting.
                </p>
              </div>
              <Link 
                href="/api/salaries?limit=5" 
                target="_blank" 
                className="w-full text-center py-2.5 bg-brand-background hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition text-brand-deep border border-brand-border hover:border-brand-primary block"
              >
                Test Endpoint →
              </Link>
            </div>

            {/* Card 2: Compound Filters */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-success/15 text-brand-success uppercase tracking-wider border border-brand-success/20">GET</span>
                  <span className="text-xs text-brand-muted font-medium">Compound Query</span>
                </div>
                <h3 className="font-mono text-sm font-bold text-brand-deep break-all">/api/salaries?company=google&level=L4&currency=INR</h3>
                <p className="text-xs text-brand-body leading-relaxed">
                  Evaluates case-insensitive token lookups, standard enums, and multi-path composite index sweeps functioning simultaneously.
                </p>
              </div>
              <Link 
                href="/api/salaries?company=google&level=L4&currency=INR" 
                target="_blank" 
                className="w-full text-center py-2.5 bg-brand-background hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition text-brand-deep border border-brand-border hover:border-brand-primary block"
              >
                Test Endpoint →
              </Link>
            </div>

            {/* Card 3: Safety limit */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-success/15 text-brand-success uppercase tracking-wider border border-brand-success/20">GET</span>
                  <span className="text-xs text-brand-muted font-medium">Limit Cap Guardrail</span>
                </div>
                <h3 className="font-mono text-sm font-bold text-brand-deep break-all">/api/salaries?limit=10000</h3>
                <p className="text-xs text-brand-body leading-relaxed">
                  Asserts backend interceptor middleware, force-capping unbounded payloads over 100 entries to `limit: 100`.
                </p>
              </div>
              <Link 
                href="/api/salaries?limit=10000" 
                target="_blank" 
                className="w-full text-center py-2.5 bg-brand-background hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition text-brand-deep border border-brand-border hover:border-brand-primary block"
              >
                Test Endpoint →
              </Link>
            </div>

            {/* Card 4: Company aggregate */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-success/15 text-brand-success uppercase tracking-wider border border-brand-success/20">GET</span>
                  <span className="text-xs text-brand-muted font-medium">Company Analytics</span>
                </div>
                <h3 className="font-mono text-sm font-bold text-brand-deep break-all">/api/companies/google</h3>
                <p className="text-xs text-brand-body leading-relaxed">
                  Verifies server-side true mathematical median computation and frequency distribution counters mapped to unique slugs.
                </p>
              </div>
              <Link 
                href="/api/companies/google" 
                target="_blank" 
                className="w-full text-center py-2.5 bg-brand-background hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition text-brand-deep border border-brand-border hover:border-brand-primary block"
              >
                Test Endpoint →
              </Link>
            </div>

            {/* Card 5: Error check */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wider border border-red-200">GET</span>
                  <span className="text-xs text-brand-muted font-medium">Error Routing</span>
                </div>
                <h3 className="font-mono text-sm font-bold text-brand-deep break-all">/api/companies/nonexistent-slug</h3>
                <p className="text-xs text-brand-body leading-relaxed">
                  Validates standard 404 response structural uniformity for unknown company slugs.
                </p>
              </div>
              <Link 
                href="/api/companies/nonexistent-slug" 
                target="_blank" 
                className="w-full text-center py-2.5 bg-brand-background hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition text-brand-deep border border-brand-border hover:border-brand-primary block"
              >
                Test Endpoint →
              </Link>
            </div>

            {/* Card 6: Compare offer */}
            <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-success/15 text-brand-success uppercase tracking-wider border border-brand-success/20">GET</span>
                  <span className="text-xs text-brand-muted font-medium">Comparison Engine</span>
                </div>
                <h3 className="font-mono text-sm font-bold text-brand-deep break-all">/api/compare</h3>
                <p className="text-xs text-brand-body leading-relaxed">
                  Compares two active salary records side-by-side to compute absolute numerical deltas. Uses real database IDs.
                </p>
              </div>
              <Link 
                href={compareUrl} 
                target="_blank" 
                className="w-full text-center py-2.5 bg-brand-background hover:bg-brand-primary hover:text-white rounded-xl text-xs font-bold transition text-brand-deep border border-brand-border hover:border-brand-primary block"
              >
                Test Endpoint →
              </Link>
            </div>

          </div>
        </section>

        {/* ======================================================
            INFORMATIONAL FOOTER (Deduplication & Ingestion Notes)
           ====================================================== */}
        <footer className="bg-brand-surface border border-brand-border p-6 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-brand-deep">
            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-extrabold text-sm tracking-tight uppercase tracking-wider">Post Ingestion Endpoint (POST /api/ingest-salary)</h3>
          </div>
          
          <p className="text-sm text-brand-body leading-relaxed">
            I suggest running a <code className="bg-brand-background px-1.5 py-0.5 rounded font-mono text-xs">POST</code> request in <strong className="text-brand-primary">Postman</strong> or via <strong className="text-brand-primary">cURL</strong> to test validation rules, 48h deduplication, and 201/400/409 error responses against:
            <br />
            <code className="bg-brand-background px-1.5 py-0.5 rounded font-mono text-xs text-brand-primary select-all block mt-2 font-semibold text-center border border-brand-border">http://localhost:3000/api/ingest-salary</code>
          </p>
        </footer>

      </div>
    </div>
  );
}
