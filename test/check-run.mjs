import { config, loadEnv } from '../server/config.mjs';
loadEnv();

async function check() {
  const key = process.env.TINYFISH_API_KEY;
  const runId = '46e4ba18-3b1e-45a1-8fdd-30ded9791d17';
  const res = await fetch(`https://agent.tinyfish.ai/v1/runs/${runId}`, {
    headers: { 'X-API-Key': key }
  });
  const data = await res.json();
  console.log('Status:', data.status);
  console.log('Num steps:', data.num_of_steps || data.steps?.length);
  if (data.steps && data.steps.length > 0) {
    console.log('Latest step:', data.steps[data.steps.length - 1].action);
  }
  if (data.result) {
    console.log('Result:', JSON.stringify(data.result, null, 2));
  }
  if (data.error) {
    console.log('Error:', data.error);
  }
}

check();
