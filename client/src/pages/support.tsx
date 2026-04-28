import { Link } from "wouter";
import { Mail, ArrowLeft, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Support() {
  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </a>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <Mail className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Contact Support</h1>
            <p className="text-neutral-gray text-sm">We usually reply within a few hours</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-accent-gold/20 rounded-xl p-5 bg-rich-brown/10 text-center">
            <Clock className="w-8 h-8 text-accent-gold mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">Response Time</p>
            <p className="text-neutral-gray text-xs mt-1">Usually within a few hours</p>
          </div>
          <div className="border border-accent-gold/20 rounded-xl p-5 bg-rich-brown/10 text-center">
            <MessageSquare className="w-8 h-8 text-accent-gold mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">Direct Line</p>
            <p className="text-neutral-gray text-xs mt-1">Gareth answers personally</p>
          </div>
          <div className="border border-accent-gold/20 rounded-xl p-5 bg-rich-brown/10 text-center">
            <CheckCircle className="w-8 h-8 text-accent-gold mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">No Ticket System</p>
            <p className="text-neutral-gray text-xs mt-1">Real person, real answers</p>
          </div>
        </div>

        <div className="border border-accent-gold/20 rounded-xl p-8 bg-rich-brown/10">
          <h2 className="text-xl font-bold text-white mb-2">Get in touch</h2>
          <p className="text-neutral-gray text-sm mb-6">
            Got a question, a billing issue, or something not working? Drop Gareth an email — he handles support directly.
          </p>

          <a
            href="mailto:gareth@smartflowsystems.co.uk?subject=Support%20Request%20-%20SocialScaleBooster"
            className="inline-flex items-center gap-3 bg-accent-gold text-primary-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Mail className="w-5 h-5" />
            gareth@smartflowsystems.co.uk
          </a>

          <div className="mt-8 border-t border-accent-gold/10 pt-6">
            <p className="text-neutral-gray text-sm font-semibold mb-3">When you email, include:</p>
            <ul className="space-y-2">
              {[
                "Your account email address",
                "What you were trying to do",
                "What happened instead (screenshot if you have one)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-gray">
                  <span className="w-1.5 h-1.5 bg-accent-gold rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
