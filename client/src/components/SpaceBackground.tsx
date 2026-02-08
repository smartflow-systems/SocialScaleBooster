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
      z: number;
      size: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      brightness: number;
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
      const starCount = Math.floor((w * h) / 2500);
      stars = [];

      for (let i = 0; i < starCount; i++) {
        const colors = [
          "255,255,255",
          "255,245,220",
          "220,235,255",
          "255,220,180",
          "200,220,255",
          "255,210,100",
        ];
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 3,
          size: Math.random() * 2 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          brightness: Math.random() * 0.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function spawnShootingStar() {
      const w = canvas!.width;
      const h = canvas!.height;
      const angle = Math.random() * 0.5 + 0.3;
      shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 8 + 6,
        angle,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
        thickness: Math.random() * 1.5 + 0.5,
      });
    }

    let time = 0;
    let shootingStarTimer = 0;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      time += 1;
      shootingStarTimer += 1;

      ctx!.clearRect(0, 0, w, h);

      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const alpha = star.brightness * (0.3 + twinkle * 0.7);
        const size = star.size * (0.7 + twinkle * 0.3) * (0.5 + star.z * 0.5);

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${star.color},${alpha})`;
        ctx!.fill();

        if (twinkle > 0.85 && star.size > 1.2) {
          const glowSize = size * 3;
          const gradient = ctx!.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowSize
          );
          gradient.addColorStop(0, `rgba(${star.color},${alpha * 0.4})`);
          gradient.addColorStop(1, `rgba(${star.color},0)`);
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
          ctx!.fillStyle = gradient;
          ctx!.fill();

          ctx!.strokeStyle = `rgba(${star.color},${alpha * 0.15})`;
          ctx!.lineWidth = 0.5;
          ctx!.beginPath();
          ctx!.moveTo(star.x - size * 3, star.y);
          ctx!.lineTo(star.x + size * 3, star.y);
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.moveTo(star.x, star.y - size * 3);
          ctx!.lineTo(star.x, star.y + size * 3);
          ctx!.stroke();
        }
      }

      if (shootingStarTimer > 120 + Math.random() * 200) {
        spawnShootingStar();
        shootingStarTimer = 0;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += 1;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity = 1 - s.life / s.maxLife;

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const gradient = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, `rgba(255,255,255,0)`);
        gradient.addColorStop(0.6, `rgba(255,245,220,${s.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(255,255,255,${s.opacity})`);

        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = s.thickness;
        ctx!.lineCap = "round";
        ctx!.stroke();

        const headGlow = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
        headGlow.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        headGlow.addColorStop(1, `rgba(255,245,220,0)`);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 4, 0, Math.PI * 2);
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
        background: "radial-gradient(ellipse at 50% 0%, #0a0a1a 0%, #050510 40%, #010108 100%)",
      }}
    />
  );
}
