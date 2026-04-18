import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];

    interface Star {
      x: number;
      y: number;
      size: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      baseAlpha: number;
      color: string;
      glowRadius: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
      maxLife: number;
      thickness: number;
      color: string;
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      const starCount = Math.floor((w * h) / 2200);
      stars = [];

      for (let i = 0; i < starCount; i++) {
        const roll = Math.random();
        const isLarge = roll > 0.88;
        const isMedium = roll > 0.65 && roll <= 0.88;

        const colors = [
          "255,255,255",
          "220,230,255",
          "255,248,220",
          "200,220,255",
          "255,240,200",
          "230,255,240",
        ];

        const size = isLarge
          ? Math.random() * 2.2 + 1.4
          : isMedium
          ? Math.random() * 1.0 + 0.6
          : Math.random() * 0.7 + 0.2;

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          twinkleSpeed: Math.random() * 0.004 + 0.001,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseAlpha: isLarge
            ? Math.random() * 0.35 + 0.55
            : isMedium
            ? Math.random() * 0.3 + 0.35
            : Math.random() * 0.25 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          glowRadius: isLarge ? size * 4 : size * 2.5,
        });
      }
    }

    function spawnShootingStar() {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      const angle = Math.random() * 0.7 + 0.15;
      const startSide = Math.random();
      let startX: number, startY: number;

      if (startSide < 0.6) {
        startX = Math.random() * w * 0.9;
        startY = Math.random() * h * 0.25;
      } else {
        startX = Math.random() * w * 0.35;
        startY = Math.random() * h * 0.5;
      }

      const isGold = Math.random() < 0.25;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 100 + 60,
        speed: Math.random() * 2.5 + 1.5,
        angle,
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 100 + 80,
        thickness: Math.random() * 1.4 + 0.7,
        color: isGold ? "255,215,80" : "255,255,255",
      });
    }

    function drawNebula(time: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      const pulse = Math.sin(time * 0.0008) * 0.015 + 0.06;

      const n1 = ctx.createRadialGradient(w * 0.25, h * 0.3, 0, w * 0.25, h * 0.3, w * 0.38);
      n1.addColorStop(0, `rgba(60,20,120,${pulse})`);
      n1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = n1;
      ctx.fillRect(0, 0, w, h);

      const n2 = ctx.createRadialGradient(w * 0.78, h * 0.55, 0, w * 0.78, h * 0.55, w * 0.32);
      n2.addColorStop(0, `rgba(20,60,100,${pulse * 0.8})`);
      n2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = n2;
      ctx.fillRect(0, 0, w, h);

      const n3 = ctx.createRadialGradient(w * 0.5, h * 0.7, 0, w * 0.5, h * 0.7, w * 0.28);
      n3.addColorStop(0, `rgba(80,40,20,${pulse * 0.6})`);
      n3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = n3;
      ctx.fillRect(0, 0, w, h);
    }

    let time = 0;
    let nextShootingStarAt = 80 + Math.random() * 120;

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      time += 1;

      ctx.clearRect(0, 0, w, h);

      drawNebula(time);

      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const secondary =
          Math.sin(time * star.twinkleSpeed * 2.3 + star.twinkleOffset * 1.7) * 0.12;
        const alpha = Math.max(0.08, star.baseAlpha * (0.5 + twinkle * 0.5) + secondary);
        const size = star.size * (0.88 + twinkle * 0.12);

        if (star.size > 0.8) {
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.glowRadius
          );
          glow.addColorStop(0, `rgba(${star.color},${alpha * 0.35})`);
          glow.addColorStop(1, `rgba(${star.color},0)`);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color},${alpha})`;
        ctx.fill();
      }

      if (time >= nextShootingStarAt) {
        spawnShootingStar();
        if (Math.random() < 0.25) spawnShootingStar();
        nextShootingStarAt = time + 180 + Math.random() * 320;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += 1;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const progress = s.life / s.maxLife;
        if (progress < 0.12) {
          s.opacity = progress / 0.12;
        } else if (progress > 0.55) {
          s.opacity = Math.max(0, (1 - progress) / 0.45);
        } else {
          s.opacity = 1.0;
        }

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, `rgba(${s.color},0)`);
        gradient.addColorStop(0.5, `rgba(${s.color},${s.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${s.color},${s.opacity * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.thickness;
        ctx.lineCap = "round";
        ctx.stroke();

        const headRadius = s.thickness * 3;
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, headRadius);
        headGlow.addColorStop(0, `rgba(${s.color},${s.opacity})`);
        headGlow.addColorStop(0.4, `rgba(${s.color},${s.opacity * 0.4})`);
        headGlow.addColorStop(1, `rgba(${s.color},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, headRadius, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 10%, #0a0818 0%, #060410 40%, #030208 75%, #010104 100%)",
      }}
    />
  );
}
