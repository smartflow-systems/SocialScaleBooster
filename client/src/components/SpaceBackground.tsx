import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const nodeCount = 55;
    const connectionDistance = 180;
    const connectionDistanceSq = connectionDistance * connectionDistance;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
    }

    let nodes: Node[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    }

    function initNodes() {
      if (!canvas) return;
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2 + 1.5,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.012 + Math.random() * 0.01,
        });
      }
    }

    let frame = 0;

    function draw() {
      if (!canvas || !ctx) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistanceSq) {
            const dist = Math.sqrt(distSq);
            const proximity = 1 - dist / connectionDistance;
            const lineAlpha = proximity * 0.55;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255, 200, 0, ${lineAlpha})`;
            ctx.lineWidth = proximity * 1.2;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const glow = Math.sin(node.pulse) * 0.5 + 0.5;
        const nodeAlpha = 0.55 + glow * 0.35;
        const nodeRadius = node.radius * (0.9 + glow * 0.2);

        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, nodeRadius * 3.5
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${nodeAlpha})`);
        gradient.addColorStop(0.4, `rgba(255, 190, 0, ${nodeAlpha * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 190, 0, 0)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 50, ${nodeAlpha})`;
        ctx.fill();
      });

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
          "radial-gradient(ellipse at 50% 40%, #141200 0%, #0c0c00 35%, #080800 65%, #040400 100%)",
      }}
    />
  );
}
