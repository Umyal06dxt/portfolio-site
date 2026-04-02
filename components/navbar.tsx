"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,5,5,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-display font-black text-sm tracking-[0.2em] uppercase text-white hover:text-[#E85002] transition-colors"
      >
        U.DIXIT
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/contact"
        className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 border border-[#E85002] text-[#E85002] hover:bg-[#E85002] hover:text-black transition-all"
      >
        [Contact]
      </Link>
    </nav>
  );
}
