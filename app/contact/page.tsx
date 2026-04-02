"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";

const subjects = [
  "Freelance Project",
  "Full-time Role",
  "Collaboration",
  "Just saying hi",
];

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/umyaldixit" },
  { label: "X / Twitter", href: "https://x.com/umyaldixit" },
  { label: "Email", href: "mailto:hello@umyal.dev" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="pt-14 min-h-screen flex flex-col md:flex-row">

        {/* Left column */}
        <div className="w-full md:w-[380px] flex-shrink-0 bg-[#080808] border-r border-white/[0.06] p-10 flex flex-col gap-10 relative overflow-hidden">
          {/* Background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className="font-display font-black text-[120px] leading-none whitespace-nowrap opacity-[0.03]"
              style={{ WebkitTextStroke: "1px white" }}
            >
              SAY HELLO
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            <div>
              <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Get In Touch</span>
            </div>

            <h2 className="font-display font-black text-5xl uppercase tracking-tighter leading-[0.9]">
              SAY <span className="text-[#E85002]">HELLO.</span>
            </h2>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E85002] animate-pulse" />
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest">Available for Work</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["React", "Three.js", "Next.js", "Python", "Figma"].map((t) => (
                <span key={t} className="px-2 py-1 border border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-3 border border-white/10 font-mono text-[11px] text-white/50 uppercase tracking-widest hover:bg-[#E85002] hover:text-black hover:border-[#E85002] transition-all"
                >
                  {s.label}
                  <span>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — form */}
        <div className="flex-1 p-10 md:p-16 flex items-start">
          {status === "sent" ? (
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Message sent</span>
              <p className="font-display font-bold text-3xl uppercase">Got it. I&apos;ll be in touch.</p>
              <button
                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="w-fit font-mono text-[11px] uppercase tracking-widest px-4 py-2 border border-white/20 text-white/50 hover:border-white hover:text-white transition-all mt-4"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-5">
              <div>
                <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Contact Form</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="bg-transparent border border-white/10 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#E85002] transition-colors placeholder:text-white/20"
                  placeholder="Your name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="bg-transparent border border-white/10 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#E85002] transition-colors placeholder:text-white/20"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="bg-[#050505] border border-white/10 px-4 py-3 font-mono text-sm text-white/60 focus:outline-none focus:border-[#E85002] transition-colors"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="bg-transparent border border-white/10 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#E85002] transition-colors placeholder:text-white/20 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status === "error" && (
                <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest">
                  // Failed to send. Try emailing directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full px-6 py-4 border-2 border-[#E85002] text-[#E85002] font-mono text-sm uppercase tracking-widest hover:bg-[#E85002] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {status === "sending" ? "SENDING..." : "SEND_MESSAGE [↗]"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
