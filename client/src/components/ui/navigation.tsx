import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";

function SmartFlowLogo() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex flex-col items-center leading-none hover:opacity-90 transition-opacity"
      aria-label="SmartFlow Systems home"
    >
      <div className="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 3 C16 3, 8 9, 5 16 C3 21, 6 27, 12 28 C14 28.5, 14 26, 16 25 C18 26, 18 28.5, 20 28 C26 27, 29 21, 27 16 C24 9, 16 3, 16 3Z"
            fill="url(#wingGrad)"
          />
          <path
            d="M16 6 C16 6, 10 11, 8 16.5 C7 20, 9.5 24, 13 25.5 C14 25.8, 14.5 24, 16 23.5 C17.5 24, 18 25.8, 19 25.5 C22.5 24, 25 20, 24 16.5 C22 11, 16 6, 16 6Z"
            fill="url(#wingInner)"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="wingGrad" x1="5" y1="3" x2="27" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <linearGradient id="wingInner" x1="8" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF4A0" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-2xl font-extrabold text-[#FFD700] tracking-tight">SmartFlo</span>
      </div>
      <span className="text-[10px] font-bold tracking-[0.35em] text-[#C8A800] uppercase -mt-0.5">SYSTEMS</span>
    </button>
  );
}

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "Work", id: "work" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#0a0900]/85 backdrop-blur-md border-b border-[#FFD700]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          <button
            className="text-neutral-400 hover:text-[#FFD700] transition-colors flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <SmartFlowLogo />
          </div>

          <div className="ml-auto flex-shrink-0">
            {user ? (
              <Button
                onClick={() => setLocation("/dashboard")}
                className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold px-5 py-2 text-sm rounded-full"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => setLocation("/login")}
                className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold px-6 py-2 text-sm rounded-full"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="bg-[#080800]/98 border-t border-[#FFD700]/10 px-4 pb-5 pt-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-left text-sm text-neutral-400 hover:text-[#FFD700] py-2.5 transition-colors font-medium border-b border-white/5 last:border-0"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <Button
              onClick={() => { setMobileOpen(false); setLocation("/dashboard"); }}
              className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold w-full mt-2 rounded-full"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <button
                onClick={() => { setMobileOpen(false); setLocation("/login"); }}
                className="text-left text-sm text-neutral-400 hover:text-[#FFD700] py-2.5 transition-colors font-medium"
              >
                Sign In
              </button>
              <Button
                onClick={() => { setMobileOpen(false); setLocation("/login"); }}
                className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold w-full mt-1 rounded-full"
              >
                Get Started Free
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
