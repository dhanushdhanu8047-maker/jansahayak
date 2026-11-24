// test/e2e-server-probe.mjs - End-to-end HTTP and API verification script
import assert from 'node:assert';
import server from '../server/index.mjs';

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runProbe() {
  console.log('🚀 Running JanSahayak AI End-to-End Server Probe...\n');

  try {
    // 1. Probe HTML Landing Page
    console.log('1. Probing GET / (Frontend Landing Page)...');
    const resHtml = await fetch(`${BASE_URL}/`);
    assert.strictEqual(resHtml.status, 200);
    const htmlText = await resHtml.text();
    assert(htmlText.includes('JanSahayak AI'), 'HTML must include JanSahayak AI branding');
    assert(htmlText.includes('navbar-root'), 'HTML must contain navbar-root');
    console.log('   ✓ Status 200 OK, HTML loaded successfully');

    // 2. Probe Static CSS
    console.log('2. Probing GET /css/styles.css...');
    const resCss = await fetch(`${BASE_URL}/css/styles.css`);
    assert.strictEqual(resCss.status, 200);
    console.log('   ✓ Status 200 OK, CSS loaded');

    // 3. Probe Health API
    console.log('3. Probing GET /api/health...');
    const resHealth = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(resHealth.status, 200);
    const healthData = await resHealth.json();
    assert.strictEqual(healthData.status, 'online');
    assert(healthData.schemesCount >= 10, 'Health data must report loaded schemes');
    console.log(`   ✓ Status 200 OK, Service: ${healthData.service}, Schemes Loaded: ${healthData.schemesCount}`);

    // 4. Probe Schemes API
    console.log('4. Probing GET /api/schemes?state=Karnataka...');
    const resSchemes = await fetch(`${BASE_URL}/api/schemes?state=Karnataka`);
    assert.strictEqual(resSchemes.status, 200);
    const schemesData = await resSchemes.json();
    assert(schemesData.count > 0, 'Karnataka schemes should be returned');
    console.log(`   ✓ Status 200 OK, Retrieved ${schemesData.count} Karnataka schemes`);

    // 5. Probe Research & AI Intelligence API (Student in Karnataka)
    console.log('5. Probing POST /api/research (22yo Karnataka student)...');
    const resResearch1 = await fetch(`${BASE_URL}/api/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'I am a 22-year-old student from Karnataka. What scholarships can I apply for?'
      })
    });
    assert.strictEqual(resResearch1.status, 200);
    const researchData1 = await resResearch1.json();
    assert(researchData1.schemes && researchData1.schemes.length > 0, 'Should return matching schemes');
    assert(researchData1.summaryCounts, 'Should include 3-tier summary counts');
    assert(researchData1.followUpQuestions, 'Should include follow-up questions');
    console.log(`   ✓ Status 200 OK: ${researchData1.schemes.length} schemes matched, Likely: ${researchData1.summaryCounts.likelyEligible}, Verification Req: ${researchData1.summaryCounts.possiblyEligible}`);

    // 6. Probe Research & AI Intelligence API (Karnataka Farmer)
    console.log('6. Probing POST /api/research (Karnataka farmer query)...');
    const resResearch2 = await fetch(`${BASE_URL}/api/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'I am a farmer in Karnataka. What financial assistance can I receive?'
      })
    });
    assert.strictEqual(resResearch2.status, 200);
    const researchData2 = await resResearch2.json();
    assert(researchData2.schemes.some(s => s.name.includes('KISAN') || s.name.includes('Raitha')), 'Should match PM-KISAN or Raitha Vidya Nidhi');
    console.log(`   ✓ Status 200 OK: Farmer query matched relevant agricultural assistance schemes`);

    // 7. Probe TinyFish Connection Diagnostics
    console.log('7. Probing POST /api/tinyfish/test-connection...');
    const resTf = await fetch(`${BASE_URL}/api/tinyfish/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const tfData = await resTf.json();
    console.log(`   ✓ TinyFish Connection Diagnostics Response: status="${tfData.status}", message="${tfData.message}"`);

    console.log('\n======================================================');
    console.log('🎉 ALL END-TO-END PROBES PASSED WITH ZERO ERRORS!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Probe Failed:', err);
    process.exit(1);
  } finally {
    server.close(() => {
      process.exit(0);
    });
  }
}

// Allow server to listen then run probe
setTimeout(runProbe, 500);
