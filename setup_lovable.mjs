import fs from 'fs';
import path from 'path';

async function setup() {
  const targetDir = 'C:/Users/M&M/.gemini/antigravity/scratch/jansahayak-ai/public';
  const assetsDir = path.join(targetDir, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // 1. Copy downloaded assets to public/assets/
  const srcDir = 'C:/Users/M&M/.gemini/antigravity/scratch/lovable_source';
  const srcFiles = fs.readdirSync(srcDir);
  for (const f of srcFiles) {
    if (f.endsWith('.js') || f.endsWith('.css')) {
      fs.copyFileSync(path.join(srcDir, f), path.join(assetsDir, f));
      console.log(`Copied ${f} to public/assets/`);
    }
  }

  // 2. Fetch fresh HTML
  const res = await fetch('https://india-scheme-scout.lovable.app');
  let html = await res.text();

  // Remove tracking telemetry script (__l5e)
  html = html.replace(/<script[^>]*src="\/__l5e\/events[^>]*><\/script>/gi, '');
  // Hide or remove lovable badge if desired, or keep it clean
  html = html.replace(/<aside id="lovable-badge"[\s\S]*?<\/aside>/gi, '');

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`Saved clean Lovable index.html (${html.length} bytes) to public/index.html`);

  // 3. Download favicon
  try {
    const favRes = await fetch('https://india-scheme-scout.lovable.app/favicon.ico');
    if (favRes.ok) {
      const buf = await favRes.arrayBuffer();
      fs.writeFileSync(path.join(targetDir, 'favicon.ico'), Buffer.from(buf));
      console.log('Downloaded favicon.ico');
    }
  } catch (e) {
    console.warn('Favicon download notice:', e.message);
  }
}

setup().catch(console.error);
