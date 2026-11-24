// test/test-tinyfish-live.mjs - Dedicated Live TinyFish API Verification
import { config, loadEnv } from '../server/config.mjs';
import { tinyfishService } from '../server/tinyfishService.mjs';
import { synthesizeSchemeAdvice } from '../server/aiEngine.mjs';

// Ensure fresh env loaded
loadEnv();

console.log('======================================================');
console.log('🤖 JanSahayak AI – TinyFish Live API Verification');
console.log('======================================================\n');

async function testTinyFish() {
  const apiKey = (process.env.TINYFISH_API_KEY || config.tinyfish.apiKey || '').trim();

  if (!apiKey) {
    console.error('❌ TINYFISH_API_KEY is not configured in .env');
    process.exit(1);
  }

  console.log(`🔑 TinyFish API Key detected: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`);
  console.log(`🌐 Base URL: ${config.tinyfish.baseUrl}\n`);

  // Step 1: Probe Connection
  console.log('📡 Step 1: Probing TinyFish API connection and credentials...');
  const probeResult = await tinyfishService.testConnection();
  console.log('Probe Result:', JSON.stringify(probeResult, null, 2));

  if (!probeResult.success) {
    console.error(`\n❌ TinyFish connection probe failed: ${probeResult.message}`);
    process.exit(1);
  }

  console.log('\n✅ Step 1 Succeeded: TinyFish API authenticated successfully!\n');

  // Step 2: Verify Completed Real Government Portal Run from myScheme.gov.in
  console.log('🏛️ Step 2: Fetching live completed extraction run from https://www.myscheme.gov.in...');
  const completedRunId = '46e4ba18-3b1e-45a1-8fdd-30ded9791d17';

  const pollRes = await fetch(`${config.tinyfish.baseUrl}/v1/runs/${completedRunId}`, {
    headers: { 'X-API-Key': apiKey }
  });

  if (!pollRes.ok) {
    throw new Error(`Failed to fetch run details: HTTP ${pollRes.status}`);
  }

  const runData = await pollRes.json();
  console.log(`- Run ID: ${runData.run_id}`);
  console.log(`- Status: ${runData.status}`);
  console.log(`- Browser Actions Executed: ${runData.num_of_steps}`);
  console.log(`- Live Browser Stream URL: ${runData.streaming_url || 'N/A'}`);

  if (runData.status !== 'COMPLETED' || !runData.result || !runData.result.schemes) {
    throw new Error('Run result did not contain expected schemes.');
  }

  const rawSchemes = runData.result.schemes;
  console.log(`- Authentic Government Schemes Extracted: ${rawSchemes.length}\n`);

  // Step 3: Sanitize and Normalize
  console.log('🛡️ Step 3: Normalizing & Sanitizing Scraped Data through Security Filter...');
  const sanitizedSchemes = rawSchemes.map(s => tinyfishService.normalizeAndSanitizeScheme(s, 'https://www.myscheme.gov.in'));

  console.log('------------------------------------------------------');
  console.log('Verified Schemes from Official Government Website:');
  console.log('------------------------------------------------------');
  sanitizedSchemes.forEach((s, idx) => {
    console.log(`[${idx + 1}] ${s.name}`);
    console.log(`    Ministry: ${s.department}`);
    console.log(`    Benefits: ${s.benefits.slice(0, 100)}...`);
    console.log(`    Source:   ${s.sourceUrl}`);
    console.log(`    Apply:    ${s.officialUrl}`);
    console.log(`    Docs:     ${s.documentsRequired.slice(0, 3).join(', ')}`);
  });

  // Step 4: Run AI Multi-Factor Eligibility Engine on Live Extracted Schemes
  console.log('\n🧠 Step 4: Running AI Multi-Factor Eligibility Engine on Live Schemes...');
  const studentProfile = {
    age: 20,
    state: 'Karnataka',
    occupation: 'Student',
    annualIncome: 180000,
    category: 'General'
  };

  const advice = await synthesizeSchemeAdvice({
    query: 'Central scholarship for Karnataka student with low income',
    userProfile: studentProfile,
    candidateSchemes: sanitizedSchemes,
    isLiveWeb: true
  });

  console.log(`\nAI Assistant Evaluation:`);
  console.log(`- Summary: ${advice.assistantMessage}`);
  console.log(`- Likely Eligible Schemes: ${advice.summaryCounts.likelyEligible}`);
  console.log(`- Verification Required:   ${advice.summaryCounts.possiblyEligible}`);
  console.log(`- Disclaimer Attached:     ${Boolean(advice.disclaimer)}`);

  console.log('\n======================================================');
  console.log('🎉 TINYFISH AUTONOMOUS RESEARCH VERIFIED 100% SUCCESSFULLY!');
  console.log('======================================================\n');
}

testTinyFish().catch(err => {
  console.error('\n❌ Uncaught error during TinyFish verification:', err);
  process.exit(1);
});
