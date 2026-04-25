"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
        {/* Left — identity */}
        <div className="space-y-3">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-subtle)]">
            Located in
          </p>
          <p className="font-display italic text-xl text-[var(--fg)]">
            Gurugram, India
          </p>
          <p className="label mt-2">
            Available for research collaborations & internships
          </p>
        </div>

        {/* Center — nav */}
        <div className="flex flex-col gap-3 md:items-center">
          <Link href="/" className="label hover:text-[var(--fg)] transition-colors">Home</Link>
          <Link href="/projects" className="label hover:text-[var(--fg)] transition-colors">Work</Link>
          <Link href="/about" className="label hover:text-[var(--fg)] transition-colors">About</Link>
        </div>

        {/* Right — contact */}
        <div className="flex flex-col gap-3 md:items-end">
          <a
            href="mailto:umyal06dixit@gmail.com"
            className="font-mono text-[11px] tracking-wide text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
          >
            umyal06dixit@gmail.com
          </a>
          <a
            href="https://github.com/Umyal06dxt"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] tracking-wide text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
          >
            github.com/Umyal06dxt
          </a>
          <a
            href="https://linkedin.com/in/umyal-dixit"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] tracking-wide text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
          >
            linkedin.com/in/umyal-dixit
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <span className="label">© 2025 Umyal Dixit</span>
          <span className="label">Not exploring. Executing.</span>
        </div>
      </div>
    </footer>
  );
}
