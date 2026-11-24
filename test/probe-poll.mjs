import { config, loadEnv } from '../server/config.mjs';
loadEnv();

async function check() {
  const key = process.env.TINYFISH_API_KEY;
  const runId = '47555dd9-b9db-4533-b833-8143e1c39f67';
  const candidates = [
    `/v1/automation/runs/${runId}`,
    `/v1/automation/run/${runId}`,
    `/v1/runs/${runId}`,
    `/runs/${runId}`
  ];

  for (const p of candidates) {
    try {
      const res = await fetch(`https://agent.tinyfish.ai${p}`, {
        headers: { 'X-API-Key': key }
      });
      console.log(p, 'Status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Result:', JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log(p, 'Err:', e.message);
    }
  }
}

check();
