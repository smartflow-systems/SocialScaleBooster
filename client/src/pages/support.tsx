import { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GlassCard, GoldButton, GhostButton, GoldHeading, SfsContainer } from "@/components/sfs";

export default function Support() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const reset = () => setForm({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.message.trim()) {
      toast({ title: "Email and message are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const body = `From: ${form.name || "Anonymous"} <${form.email}>%0D%0A%0D%0A${encodeURIComponent(form.message)}`;
      const subject = encodeURIComponent(form.subject || "SmartFlow Support Request");
      window.location.href = `mailto:support@smartflow.systems?subject=${subject}&body=${body}`;
      toast({ title: "Opening your email client", description: "Send the prepared email to reach support." });
      reset();
    } catch (err: any) {
      toast({ title: "Could not open email client", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
            <Mail className="w-6 h-6 text-[var(--sf-black)]" />
          </div>
          <div>
            <GoldHeading level={1} className="text-2xl font-bold">Contact Support</GoldHeading>
            <p className="text-neutral-400 text-sm">Get in touch with our support team</p>
          </div>
        </div>
        <GlassCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Your name</Label>
                <Input id="name" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input id="email" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-white">Subject</Label>
              <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">Message *</Label>
              <Textarea id="message" required rows={6} placeholder="Tell us what you need help with..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <GhostButton type="button" onClick={reset} disabled={submitting}>Cancel</GhostButton>
              <GoldButton type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </GoldButton>
            </div>
          </form>
        </GlassCard>
      </SfsContainer>
    </div>
  );
}
