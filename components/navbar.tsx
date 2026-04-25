"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "@/components/magnetic";
import { useScramble } from "@/hooks/use-scramble";

const links = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
];

function ScrambleLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scramble, reset } = useScramble(label, 400);

  return (
    <Link
      href={href}
      className="nav-link"
      onMouseEnter={() => scramble(ref.current)}
      onMouseLeave={() => reset(ref.current)}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: active ? "var(--fg)" : "var(--fg-muted)",
        textDecoration: "none",
      }}
    >
      <span ref={ref}>{label}</span>
      {active && (
        <span
          style={{
            position: "absolute",
            bottom: -4,
            left: 0,
            width: "100%",
            height: 1,
            background: "var(--accent)",
          }}
        />
      )}
    </Link>
  );
}

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
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{
          background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(237,230,214,0.06)" : "none",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        }}
      >
        <div
          className="flex items-center justify-between px-6 md:px-10"
          style={{ height: 56 }}
        >
          {/* Wordmark */}
          <Magnetic strength={0.25}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--fg)",
                textDecoration: "none",
              }}
            >
              U.DIXIT
            </Link>
          </Magnetic>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <ScrambleLink
                key={l.href}
                label={l.label}
                href={l.href}
                active={pathname === l.href}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Magnetic strength={0.2}>
              <a
                href="mailto:umyal06dixit@gmail.com"
                className="btn-outline"
                style={{ padding: "9px 18px" }}
              >
                <span>Say hi</span>
              </a>
            </Magnetic>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-px bg-[var(--fg)]"
                animate={{
                  width: i === 1 ? (menuOpen ? 14 : 20) : 20,
                  rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                  y: menuOpen && i === 0 ? 6 : menuOpen && i === 2 ? -6 : 0,
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-center px-8 md:hidden"
            style={{ background: "rgba(10,10,10,0.97)" }}
          >
            <div className="flex flex-col gap-8 w-full">
              {[{ label: "Home", href: "/" }, ...links].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    className="display-md block"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2.5rem, 10vw, 4rem)",
                      color: pathname === l.href ? "var(--accent)" : "var(--fg)",
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <a
                  href="mailto:umyal06dixit@gmail.com"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    color: "var(--fg-muted)",
                    textDecoration: "none",
                  }}
                >
                  umyal06dixit@gmail.com
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
