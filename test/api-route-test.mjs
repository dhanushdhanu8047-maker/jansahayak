// test/api-route-test.mjs - Comprehensive In-Process API Route & Handler Verification
import assert from 'node:assert';
import { EventEmitter } from 'node:events';
import server from '../server/index.mjs';

function createMockReqRes({ method = 'GET', url = '/', body = null }) {
  const req = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = { host: 'localhost:3000', 'content-type': 'application/json' };
  req.socket = { remoteAddress: '127.0.0.1' };

  let statusCode = 200;
  let headersSent = false;
  const resHeaders = {};
  let responseData = '';

  const res = new EventEmitter();
  res.headersSent = false;
  res.writeHead = (code, headersObj = {}) => {
    statusCode = code;
    res.headersSent = true;
    Object.assign(resHeaders, headersObj);
  };
  res.setHeader = (key, val) => {
    resHeaders[key.toLowerCase()] = val;
  };
  res.write = (chunk) => {
    responseData += chunk.toString();
  };
  res.end = (chunk) => {
    if (chunk) responseData += chunk.toString();
    res.headersSent = true;
    res.emit('finish');
  };

  const promise = new Promise((resolve) => {
    res.on('finish', () => {
      let json = null;
      try {
        json = JSON.parse(responseData);
      } catch (_) {}
      resolve({
        statusCode,
        headers: resHeaders,
        body: responseData,
        json
      });
    });
  });

  // Schedule data emission on nextTick so request listener attaches first
  process.nextTick(() => {
    if (body) {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      req.emit('data', Buffer.from(payload));
    }
    req.emit('end');
  });

  return { req, res, promise };
}

async function testRoute({ method = 'GET', url = '/', body = null }) {
  const { req, res, promise } = createMockReqRes({ method, url, body });
  server.emit('request', req, res);
  return await promise;
}

async function runTests() {
  console.log('🧪 Testing Server Routes & APIs In-Process...\n');

  // 1. GET /api/health
  console.log('1. Testing GET /api/health...');
  const healthRes = await testRoute({ method: 'GET', url: '/api/health' });
  assert.strictEqual(healthRes.statusCode, 200);
  assert.strictEqual(healthRes.json.status, 'online');
  assert(healthRes.json.schemesCount >= 10);
  console.log(`   ✓ Pass! Service: ${healthRes.json.service}, Schemes: ${healthRes.json.schemesCount}`);

  // 2. GET /api/schemes
  console.log('2. Testing GET /api/schemes...');
  const schemesRes = await testRoute({ method: 'GET', url: '/api/schemes' });
  assert.strictEqual(schemesRes.statusCode, 200);
  assert(schemesRes.json.count >= 10);
  console.log(`   ✓ Pass! Returned ${schemesRes.json.count} schemes`);

  // 3. GET /api/schemes?state=Karnataka
  console.log('3. Testing GET /api/schemes?state=Karnataka...');
  const karnatakaRes = await testRoute({ method: 'GET', url: '/api/schemes?state=Karnataka' });
  assert.strictEqual(karnatakaRes.statusCode, 200);
  assert(karnatakaRes.json.count > 0);
  console.log(`   ✓ Pass! Filtered ${karnatakaRes.json.count} Karnataka schemes`);

  // 4. GET /api/schemes/:id
  console.log('4. Testing GET /api/schemes/ssp-karnataka-post-matric...');
  const singleRes = await testRoute({ method: 'GET', url: '/api/schemes/ssp-karnataka-post-matric' });
  assert.strictEqual(singleRes.statusCode, 200);
  assert.strictEqual(singleRes.json.scheme.id, 'ssp-karnataka-post-matric');
  console.log(`   ✓ Pass! Scheme: "${singleRes.json.scheme.name}"`);

  // 5. POST /api/research (Student in Karnataka)
  console.log('5. Testing POST /api/research for student query...');
  const researchRes = await testRoute({
    method: 'POST',
    url: '/api/research',
    body: {
      query: 'I am a 22-year-old student from Karnataka. What scholarships can I apply for?'
    }
  });
  assert.strictEqual(researchRes.statusCode, 200);
  assert(researchRes.json.schemes && researchRes.json.schemes.length > 0);
  assert(researchRes.json.summaryCounts.total > 0);
  assert(researchRes.json.followUpQuestions.length > 0);
  console.log(`   ✓ Pass! Matched ${researchRes.json.schemes.length} schemes. Likely: ${researchRes.json.summaryCounts.likelyEligible}`);

  // 6. POST /api/tinyfish/test-connection
  console.log('6. Testing POST /api/tinyfish/test-connection diagnostics...');
  const tfRes = await testRoute({ method: 'POST', url: '/api/tinyfish/test-connection' });
  assert([200, 400].includes(tfRes.statusCode));
  console.log(`   ✓ Pass! Status: ${tfRes.json.status}, Message: ${tfRes.json.message}`);

  // 7. GET / (Frontend HTML)
  console.log('7. Testing GET / (Static Frontend)...');
  const frontRes = await testRoute({ method: 'GET', url: '/' });
  assert.strictEqual(frontRes.statusCode, 200);
  assert(frontRes.body.includes('JanSahayak AI'));
  console.log(`   ✓ Pass! Frontend index.html served cleanly (${frontRes.body.length} bytes)`);

  console.log('\n======================================================');
  console.log('🎉 ALL IN-PROCESS API ROUTE TESTS PASSED 100%!');
  console.log('======================================================\n');

  server.close(() => process.exit(0));
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
