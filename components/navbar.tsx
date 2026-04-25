"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(10,10,10,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(237,230,214,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.25em] uppercase text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-200"
          >
            U.DIXIT
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-200"
                  style={{ color: active ? "var(--fg)" : "var(--fg-muted)" }}
                >
                  {l.label}
                  {active && (
                    <span className="ml-1.5 inline-block w-1 h-1 rounded-full bg-[var(--accent)] align-middle" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <a
            href="mailto:umyal06dixit@gmail.com"
            className="hidden md:block font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200"
          >
            Say hi
          </a>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-px bg-[var(--fg)] transition-all duration-300"
              style={{ transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none" }}
            />
            <span
              className="block w-5 h-px bg-[var(--fg)] transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-px bg-[var(--fg)] transition-all duration-300"
              style={{ transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
            style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex flex-col items-center gap-10">
              <Link href="/" className="font-display display-md text-4xl text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (i + 1) }}
                >
                  <Link
                    href={l.href}
                    className="font-display display-md text-4xl text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="mailto:umyal06dixit@gmail.com"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-mono text-xs tracking-widest uppercase text-[var(--accent)]"
              >
                umyal06dixit@gmail.com
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
