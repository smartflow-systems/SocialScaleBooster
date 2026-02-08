import { Link } from "wouter";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default function Captions() {
  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </a>
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <MessageSquare className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Caption Generator</h1>
            <p className="text-neutral-gray text-sm">Generate engaging captions with AI assistance</p>
          </div>
        </div>
        <div className="border border-accent-gold/20 rounded-xl p-8 bg-rich-brown/20 text-center">
          <MessageSquare className="w-16 h-16 text-accent-gold/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
          <p className="text-neutral-gray max-w-md mx-auto">
            This feature is under development. Generate engaging captions with AI assistance will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
