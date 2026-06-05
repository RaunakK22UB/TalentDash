const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== STARTING TALENTDASH BACKEND API VERIFICATION TESTS ===\n');

  let testCount = 0;
  let passCount = 0;

  function assert(condition: boolean, message: string) {
    testCount++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // Helper for JSON POST requests
  async function postJson(path: string, body: any) {
    return await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }

  // Helper for GET requests
  async function getJson(path: string) {
    return await fetch(`${BASE_URL}${path}`);
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Ingestion API - Success Case
    // ----------------------------------------------------
    console.log('Running Test 1: Ingesting a valid salary record...');
    const payload1 = {
      company_name: 'Acme Corp Ltd',
      industry: 'Anvil Manufacturing',
      headquarters: 'Phoenix, AZ',
      role: 'Anvil Inspector',
      level: 'L3',
      location: 'Phoenix',
      currency: 'USD',
      experience_years: 2,
      base_salary: 8000000, // $80,000 in cents
      bonus: 1000000,       // $10,000 in cents
      stock: 500000,        // $5,000 in cents
      source: 'CONTRIBUTOR',
      confidence_score: 0.90,
      is_verified: true
    };

    const res1 = await postJson('/api/ingest-salary', payload1);
    assert(res1.status === 201, `Ingestion status is 201 (Actual: ${res1.status})`);
    
    const body1 = await res1.json();
    assert(body1.id !== undefined, 'Response includes a generated UUID');
    assert(body1.total_compensation === 9500000, `total_compensation is computed correctly on server: 9500000 (Actual: ${body1.total_compensation})`);
    assert(body1.company !== undefined && body1.company.slug === 'acme-corp', `Company alias normalized to acme-corp (Actual: ${body1.company?.slug})`);

    const id1 = body1.id;

    // ----------------------------------------------------
    // TEST 2: Ingestion API - Validation Rejections
    // ----------------------------------------------------
    console.log('\nRunning Test 2: Ingestion validation rejections...');
    
    // Out-of-bounds experience years
    const invalidPayload1 = { ...payload1, experience_years: 55 };
    const resVal1 = await postJson('/api/ingest-salary', invalidPayload1);
    assert(resVal1.status === 400, 'Ingestion rejects out-of-bounds experience_years (55) with 400');
    const valBody1 = await resVal1.json();
    assert(valBody1.field === 'experience_years', `Rejection specifies field 'experience_years' (Actual: ${valBody1.field})`);

    // Invalid location with country suffix
    const invalidPayload2 = { ...payload1, location: 'Bengaluru, India' };
    const resVal2 = await postJson('/api/ingest-salary', invalidPayload2);
    assert(resVal2.status === 400, 'Ingestion rejects location with country suffix with 400');
    const valBody2 = await resVal2.json();
    assert(valBody2.field === 'location', `Rejection specifies field 'location' (Actual: ${valBody2.field})`);

    // Negative base salary
    const invalidPayload3 = { ...payload1, base_salary: -100 };
    const resVal3 = await postJson('/api/ingest-salary', invalidPayload3);
    assert(resVal3.status === 400, 'Ingestion rejects negative base_salary with 400');

    // ----------------------------------------------------
    // TEST 3: Ingestion API - 48-Hour Proximity Deduplication
    // ----------------------------------------------------
    console.log('\nRunning Test 3: Ingestion deduplication checking...');
    // Attempting to post similar record within 48h (identical company, role, level, location, and base_salary within 10%)
    const duplicatePayload = {
      ...payload1,
      base_salary: 8200000 // 82,000 cents (within 10% of 80,000)
    };

    const resDup = await postJson('/api/ingest-salary', duplicatePayload);
    assert(resDup.status === 409, `Deduplication rejects similar submission with 409 Conflict (Actual: ${resDup.status})`);
    
    const dupBody = await resDup.json();
    assert(dupBody.error === true && dupBody.message.includes('Conflict'), 'Error payload has conflict warning message');

    // ----------------------------------------------------
    // TEST 4: Search and Filter API
    // ----------------------------------------------------
    console.log('\nRunning Test 4: Paginated Search and Filters...');
    // Fetch google salaries sorted by compensation
    const resSearch = await getJson('/api/salaries?company=google&sort=total_comp_desc&limit=3');
    assert(resSearch.status === 200, `Search endpoint works (Actual: ${resSearch.status})`);
    
    const searchBody = await resSearch.json();
    assert(Array.isArray(searchBody.data), 'data is returned as an array');
    assert(searchBody.meta !== undefined, 'meta wrapping exists');
    assert(searchBody.data.length <= 3, `respects limit of 3 (Actual size: ${searchBody.data.length})`);
    assert(searchBody.data[0].company.slug === 'google', 'Filters to Google company slug');

    // Test ceiling limit intercept (limit=10000)
    const resCeiling = await getJson('/api/salaries?limit=10000');
    const ceilingBody = await resCeiling.json();
    assert(ceilingBody.meta.limit === 100, `limit query parameter of 10000 capped to 100 ceiling (Actual: ${ceilingBody.meta.limit})`);
    assert(ceilingBody.data.length <= 100, 'Returned array size respects ceiling');

    // ----------------------------------------------------
    // TEST 5: Company Details & Analytics API
    // ----------------------------------------------------
    console.log('\nRunning Test 5: Company Analytics profile...');
    const resComp = await getJson('/api/companies/google');
    assert(resComp.status === 200, `Analytics query successful (Actual: ${resComp.status})`);
    
    const compBody = await resComp.json();
    assert(compBody.company !== undefined && compBody.company.slug === 'google', 'Returns Google company details');
    assert(compBody.stats !== undefined, 'Returns calculated stats block');
    assert(typeof compBody.stats.median_compensation === 'number', `Computes a valid median compensation: ${compBody.stats.median_compensation}`);
    assert(compBody.stats.level_distribution !== undefined, 'Returns level distribution map');
    assert(compBody.stats.level_distribution.L3 > 0, `L3 level count is recorded: ${compBody.stats.level_distribution.L3}`);
    assert(Array.isArray(compBody.salaries) && compBody.salaries.length > 0, 'Contains salaries array');
    
    // Check descending total_compensation sorting in company profiles
    const firstComp = compBody.salaries[0].total_compensation;
    const lastComp = compBody.salaries[compBody.salaries.length - 1].total_compensation;
    assert(firstComp >= lastComp, `Salaries are sorted descending by compensation (First: ${firstComp}, Last: ${lastComp})`);

    // Non-existent company slug
    const resCompMissing = await getJson('/api/companies/non-existent-company');
    assert(resCompMissing.status === 404, `Missing company returns 404 (Actual: ${resCompMissing.status})`);
    const compMissingBody = await resCompMissing.json();
    assert(compMissingBody.error === true, 'Returns error body for missing company');

    // ----------------------------------------------------
    // TEST 6: Comparison Delta Engine API
    // ----------------------------------------------------
    console.log('\nRunning Test 6: Comparison Delta Engine...');
    
    // Get another salary id from Search
    const searchRes2 = await getJson('/api/salaries?company=google');
    const searchBody2 = await searchRes2.json();
    const id2 = searchBody2.data[1].id; // Different google salary id

    const resCompare = await getJson(`/api/compare?s1=${id1}&s2=${id2}`);
    assert(resCompare.status === 200, `Compare request successful (Actual: ${resCompare.status})`);
    
    const compareBody = await resCompare.json();
    assert(compareBody.delta !== undefined, 'Response includes calculated delta object');
    assert(typeof compareBody.delta.base_delta === 'number', `Calculates base delta (Actual: ${compareBody.delta.base_delta})`);
    assert(typeof compareBody.delta.tc_delta === 'number', `Calculates total compensation delta (Actual: ${compareBody.delta.tc_delta})`);

    // Identical parameters validation
    const resCompareIdentical = await getJson(`/api/compare?s1=${id1}&s2=${id1}`);
    assert(resCompareIdentical.status === 400, `Comparing identical records blocked with 400 (Actual: ${resCompareIdentical.status})`);

    // Non-existent UUID validation
    const fakeUuid = '00000000-0000-4000-8000-000000000000';
    const resCompareFake = await getJson(`/api/compare?s1=${id1}&s2=${fakeUuid}`);
    assert(resCompareFake.status === 404, `Missing record compare returns 404 (Actual: ${resCompareFake.status})`);

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n======================================================');
    console.log(`VERIFICATION COMPLETED: ${passCount}/${testCount} TESTS PASSED`);
    console.log('======================================================');
    
    if (passCount !== testCount) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during test run:', err);
    process.exit(1);
  }
}

runTests();
