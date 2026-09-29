// focuflow/frontend/src/components/InteractiveStars.jsx

import React, { useRef, useEffect } from 'react';

const InteractiveStars = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // --- DPR scaling for crispness on high-res screens ---
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    function resizeCanvas() {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();

    // --- Mouse state with velocity ---
    const mouse = {
      x: null,
      y: null,
      lastX: null,
      lastY: null,
      vx: 0,
      vy: 0,
      speed: 0,
      radius: 160,              // Proximity radius (px)
      speedEpsilon: 0.05,       // Min speed to consider "moving"
      lastMoveTs: performance.now()
    };

    function onMouseMove(e) {
      const now = performance.now();
      const dt = Math.max(1, now - mouse.lastMoveTs); // ms
      const x = e.clientX;
      const y = e.clientY;

      if (mouse.lastX != null && mouse.lastY != null) {
        mouse.vx = (x - mouse.lastX) / dt; // px/ms
        mouse.vy = (y - mouse.lastY) / dt;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      }

      mouse.x = x;
      mouse.y = y;
      mouse.lastX = x;
      mouse.lastY = y;
      mouse.lastMoveTs = now;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // --- Stars setup ---
    let stars = [];
    function starCount() {
      return Math.floor((window.innerWidth * window.innerHeight) / 2500);
    }

    class Star {
      constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.color = color;
        this.density = Math.random() * 2 + 0.5; // Mild per-star variance
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        const hasMouse =
          mouse.x != null && mouse.y != null && mouse.speed > mouse.speedEpsilon;

        if (hasMouse) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 0 && dist < mouse.radius) {
            const proximity = 1 - dist / mouse.radius;
            const speedFactor = Math.min(mouse.speed * 40, 1.5);
            const force = proximity * 3.0 * speedFactor * this.density;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          } else {
            this.springBack();
          }
        } else {
          this.springBack();
        }

        if (Math.random() < 0.0008) {
          this.size = Math.random() * 2 + 1;
        }

        this.draw();
      }

      springBack() {
        const k = 0.08;
        const dx = this.baseX - this.x;
        const dy = this.baseY - this.y;
        this.x += dx * k;
        this.y += dy * k;
      }
    }

    function init() {
      stars = [];
      const n = starCount();
      for (let i = 0; i < n; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const alpha = Math.random() * 0.8 + 0.2;
        const color = `rgba(255,255,255,${alpha})`;
        stars.push(new Star(x, y, size, color));
      }
    }

    let rafId = 0;
    function animate() {
      rafId = requestAnimationFrame(animate);
      // Use the scaled width/height for clearing
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
      }
    }

    function onResize() {
      resizeCanvas();
      init();
    }

    window.addEventListener('resize', onResize);

    init();
    animate();

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
      }}
    />
  );
};

export default InteractiveStars;