import { config, loadEnv } from '../server/config.mjs';

loadEnv();

async function run() {
  const apiKey = (process.env.TINYFISH_API_KEY || config.tinyfish.apiKey || '').trim();
  console.log('Using API key:', apiKey.slice(0, 4) + '...' + apiKey.slice(-4));

  try {
    const res = await fetch('https://agent.tinyfish.ai/v1/automation/run-async', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        url: 'https://example.com',
        goal: 'Extract page title',
      }),
    });

    console.log('Status:', res.status, res.statusText);
    const body = await res.json().catch(async () => await res.text());
    console.log('Response body:', JSON.stringify(body, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();
