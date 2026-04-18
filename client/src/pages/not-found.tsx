import { useLocation } from "wouter";
import { AlertCircle } from "lucide-react";
import { GlassCard, GoldHeading, GhostButton, SfsContainer } from "@/components/sfs";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <SfsContainer className="max-w-md">
        <GlassCard className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="h-7 w-7 text-[hsl(var(--destructive))]" />
            <GoldHeading level={1} className="text-3xl">404</GoldHeading>
          </div>
          <p className="text-sm text-neutral-400 mb-6">
            We couldn't find the page you were looking for.
          </p>
          <GhostButton onClick={() => setLocation("/")}>Go home</GhostButton>
        </GlassCard>
      </SfsContainer>
    </div>
  );
}
