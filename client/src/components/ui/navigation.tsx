import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "Work", id: "work" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur border-b border-[#FFD700]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/")}
            className="text-xl font-bold text-[#FFD700] tracking-tight hover:opacity-80 transition-opacity"
          >
            SmartFlow Systems
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm text-neutral-400 hover:text-[#FFD700] transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("contact")}
              className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold px-5 py-2 text-sm"
            >
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-neutral-400 hover:text-[#FFD700] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-[#FFD700]/10 px-4 pb-4 pt-2 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-left text-sm text-neutral-400 hover:text-[#FFD700] py-2 transition-colors font-medium"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={() => scrollTo("contact")}
            className="bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E6C200] font-bold w-full mt-1"
          >
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
}
