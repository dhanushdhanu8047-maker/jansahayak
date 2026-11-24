// public/js/threeBackground.js - Next-Gen 3D Interactive Cyber-Particle Space
export function init3DBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Check WebGL / Three.js availability
  if (typeof THREE !== 'undefined') {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 40;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 1. Create 3D Holographic Particle Globe / Cloud
      const particleCount = 1200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      // Colors: Saffron (#f97316), Soft White (#f8fafc), Emerald (#10b981)
      const colorSaffron = new THREE.Color(0xf97316);
      const colorWhite = new THREE.Color(0xe2e8f0);
      const colorEmerald = new THREE.Color(0x10b981);
      const colorCyan = new THREE.Color(0x06b6d4);

      for (let i = 0; i < particleCount; i++) {
        // Spherical distribution with layered depth
        const radius = 22 + Math.random() * 25;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Mix colors
        let c;
        const rand = Math.random();
        if (rand < 0.35) c = colorSaffron;
        else if (rand < 0.7) c = colorEmerald;
        else if (rand < 0.88) c = colorCyan;
        else c = colorWhite;

        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Create glowing round particle texture using canvas
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 32;
      pCanvas.height = 32;
      const pCtx = pCanvas.getContext('2d');
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);

      const pTexture = new THREE.CanvasTexture(pCanvas);

      const material = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        map: pTexture,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // 2. Add 3D Cyber Geometric Rings (Chakra motif)
      const ringGeom = new THREE.TorusGeometry(18, 0.08, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 3;
      scene.add(ring);

      const ringGeom2 = new THREE.TorusGeometry(26, 0.05, 16, 120);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.18,
        wireframe: true
      });
      const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
      ring2.rotation.x = -Math.PI / 4;
      scene.add(ring2);

      // Mouse Parallax
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
      }, { passive: true });

      // Resize Handler
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Animation Loop
      function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        particleSystem.rotation.y += 0.0012;
        particleSystem.rotation.x += 0.0006;

        ring.rotation.z += 0.002;
        ring.rotation.y += 0.001;

        ring2.rotation.z -= 0.0015;
        ring2.rotation.x -= 0.0008;

        camera.position.x = targetX * 15;
        camera.position.y = -targetY * 15;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      animate();
      return;
    } catch (e) {
      console.warn('Three.js init fallback:', e);
    }
  }

  // 2D High-Tech Canvas Fallback if WebGL/Three.js fails
  init2DCanvasFallback(canvas);
}

function init2DCanvasFallback(canvas) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 2 + 1,
    color: Math.random() > 0.5 ? 'rgba(249, 115, 22, 0.4)' : 'rgba(16, 185, 129, 0.4)'
  }));

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }
  render();
}
