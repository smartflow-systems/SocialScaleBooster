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
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      const w = canvas!.width;
      const h = canvas!.height;
      const starCount = Math.floor((w * h) / 4000);
      stars = [];

      for (let i = 0; i < starCount; i++) {
        const colors = [
          "255,255,255",
          "240,240,255",
          "255,250,240",
          "230,240,255",
        ];
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() < 0.92 ? Math.random() * 0.8 + 0.2 : Math.random() * 1.4 + 0.6,
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseAlpha: Math.random() * 0.3 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function spawnShootingStar() {
      const w = canvas!.width;
      const h = canvas!.height;
      const angle = Math.random() * 0.8 + 0.1;
      const startSide = Math.random();
      let startX: number, startY: number;
      if (startSide < 0.5) {
        startX = Math.random() * w;
        startY = Math.random() * h * 0.2;
      } else {
        startX = Math.random() * w * 0.3 + w * 0.2;
        startY = Math.random() * h * 0.4;
      }

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 40 + 25,
        speed: Math.random() * 4 + 3,
        angle,
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 50 + 35,
        thickness: Math.random() * 0.6 + 0.3,
      });
    }

    let time = 0;
    let nextShootingStarAt = 400 + Math.random() * 600;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      time += 1;

      ctx!.clearRect(0, 0, w, h);

      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const noise = Math.sin(time * star.twinkleSpeed * 3.7 + star.twinkleOffset * 2.3) * 0.15;
        const alpha = Math.max(0.04, star.baseAlpha * (0.4 + twinkle * 0.6) + noise);
        const size = star.size * (0.85 + twinkle * 0.15);

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${star.color},${alpha})`;
        ctx!.fill();

        if (star.size > 1.2 && twinkle > 0.9) {
          const glow = ctx!.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, size * 2.5
          );
          glow.addColorStop(0, `rgba(${star.color},${alpha * 0.2})`);
          glow.addColorStop(1, `rgba(${star.color},0)`);
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, size * 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = glow;
          ctx!.fill();
        }
      }

      if (time >= nextShootingStarAt) {
        spawnShootingStar();
        nextShootingStarAt = time + 500 + Math.random() * 900;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += 1;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        const progress = s.life / s.maxLife;
        if (progress < 0.15) {
          s.opacity = progress / 0.15;
        } else if (progress > 0.6) {
          s.opacity = Math.max(0, (1 - progress) / 0.4);
        } else {
          s.opacity = 0.7;
        }

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const gradient = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, `rgba(255,255,255,0)`);
        gradient.addColorStop(0.7, `rgba(255,252,245,${s.opacity * 0.15})`);
        gradient.addColorStop(1, `rgba(255,255,255,${s.opacity * 0.5})`);

        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = s.thickness;
        ctx!.lineCap = "round";
        ctx!.stroke();

        const headGlow = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, 2);
        headGlow.addColorStop(0, `rgba(255,255,255,${s.opacity * 0.6})`);
        headGlow.addColorStop(1, `rgba(255,255,255,0)`);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = headGlow;
        ctx!.fill();
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
        background: "radial-gradient(ellipse at 50% 0%, #080812 0%, #040408 50%, #010104 100%)",
      }}
    />
  );
}
