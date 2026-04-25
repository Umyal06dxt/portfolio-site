"use client";

import Footer from "@/components/footer";
import Magnetic from "@/components/magnetic";
import Navbar from "@/components/navbar";
import { useScramble } from "@/hooks/use-scramble";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

/* ─── Data ──────────────────────────────────────────────────── */

const marqueeItems = [
  "10× Hackathon Winner", "AI Researcher", "Gurugram, India",
  "CS Student", "Hardware Builder", "Public Speaker",
  "Late-night Builder", "System Thinker", "Web3 Builder", "Emotion AI",
];

const featuredProjects = [
  {
    num: "01", name: "Veris", status: "live" as const,
    tagline: "Hardware proof that a photograph is real.",
    desc: "Built for an age of deepfakes. Hardware-first authenticity embedded at the moment of capture.",
    tags: ["Web3", "Blockchain", "CV"],
    visual: "veris" as const,
  },
  {
    num: "02", name: "Sukku", status: "live" as const,
    tagline: "An AI companion that notices.",
    desc: "Proactive, emotionally aware, contextually intelligent. Not another reactive assistant.",
    tags: ["Edge AI", "NLP", "Behavioral AI"],
    visual: "sukku" as const,
  },
  {
    num: "03", name: "Emotion AI", status: "research" as const,
    tagline: "26 emotions. One face.",
    desc: "Deep learning beyond 6 basic emotions — into contempt, awe, confusion, embarrassment.",
    tags: ["PyTorch", "Attention", "Research"],
    visual: "emotion" as const,
  },
];

const researchQs = [
  "Can a machine tell the difference between a smile that means happiness and a smile that means pain?",
  "Can we build AI companions that earn trust — not just simulate it?",
  "In a world where any image can be faked, what does it mean to prove something is real?",
  "How do we build systems that don't just respond to humans — but grow with them?",
];

const heroLines = [
  { text: "I don't just",     color: "var(--fg)" },
  { text: "build things.",    color: "var(--accent)" },
  { text: "I imagine what",   color: "var(--fg-muted)" },
  { text: "they could mean.", color: "var(--fg-muted)" },
];

/* ─── Hero dot grid background ──────────────────────────────── */

function HeroDotGrid() {
  const cols = 20;
  const rows = 12;
  const total = cols * rows;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        pointerEvents: "none",
        zIndex: 0,
        maskImage:
          "radial-gradient(ellipse 70% 70% at 75% 50%, black 20%, transparent 80%)",
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const distFromRight = cols - col;
        const distFromCenter = Math.abs(row - rows / 2);
        const chance = Math.random();
        const isLit = chance > 0.85 && distFromRight < 14;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isLit ? { opacity: [0, 0.6, 0.2, 0.7, 0.1, 0.5] } : { opacity: 0.06 }}
            transition={
              isLit
                ? {
                    duration: 3 + Math.random() * 4,
                    delay: Math.random() * 5,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }
                : { duration: 1, delay: (col + row) * 0.02 }
            }
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: isLit ? "var(--accent)" : "var(--fg)",
              justifySelf: "center",
              alignSelf: "center",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Project card visuals — unique per project ─────────────── */

function VerisVisual() {
  /* Hexagonal grid + scan line — represents blockchain verification */
  const hexSize = 18;
  const hxs: { x: number; y: number }[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 9; col++) {
      hxs.push({
        x: col * (hexSize * 1.75) + (row % 2 === 0 ? 0 : hexSize * 0.875),
        y: row * (hexSize * 1.5),
      });
    }
  }

  return (
    <div style={{ position: "relative", height: 150, overflow: "hidden", background: "rgba(255,95,31,0.04)", borderBottom: "1px solid var(--border)" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {hxs.map((h, i) => (
          <motion.polygon
            key={i}
            points={`${h.x},${h.y - hexSize} ${h.x + hexSize * 0.866},${h.y - hexSize * 0.5} ${h.x + hexSize * 0.866},${h.y + hexSize * 0.5} ${h.x},${h.y + hexSize} ${h.x - hexSize * 0.866},${h.y + hexSize * 0.5} ${h.x - hexSize * 0.866},${h.y - hexSize * 0.5}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.5"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 2 + (i % 5) * 0.4, delay: i * 0.05, repeat: Infinity }}
          />
        ))}
      </svg>

      {/* Scan line sweeping top → bottom */}
      <motion.div
        style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent 0%, var(--accent) 30%, rgba(255,95,31,0.6) 60%, transparent 100%)",
          boxShadow: "0 0 12px var(--accent)",
        }}
        animate={{ top: ["-5%", "110%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
      />

      {/* Verified badge */}
      <div style={{
        position: "absolute", bottom: 12, right: 14,
        fontFamily: "var(--font-mono)", fontSize: 9,
        color: "var(--accent)", letterSpacing: "0.18em",
        textTransform: "uppercase", opacity: 0.7,
      }}>
        chain-of-custody
      </div>
    </div>
  );
}

function SukkuVisual() {
  /* Radar rings pulsing outward — "noticing" / sensing presence */
  const rings = [0, 1, 2, 3, 4];
  return (
    <div style={{ position: "relative", height: 150, overflow: "hidden", background: "rgba(255,95,31,0.03)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {rings.map((i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            border: "1px solid var(--accent)",
          }}
          animate={{
            width: [`${30 + i * 30}px`, `${80 + i * 35}px`],
            height: [`${30 + i * 30}px`, `${80 + i * 35}px`],
            opacity: [0.7 - i * 0.12, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Static rings for depth */}
      {[40, 80, 120].map((size, i) => (
        <div key={i} style={{ position: "absolute", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(255,95,31,0.12)" }} />
      ))}

      {/* Center dot */}
      <motion.div
        style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", position: "relative", zIndex: 1 }}
        animate={{ scale: [1, 1.4, 1], boxShadow: ["0 0 0 0 rgba(255,95,31,0.4)", "0 0 0 8px rgba(255,95,31,0)", "0 0 0 0 rgba(255,95,31,0)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div style={{ position: "absolute", bottom: 12, right: 14, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
        proximity detected
      </div>
    </div>
  );
}

function EmotionVisual() {
  /* 8×6 dot face grid — lights up to show different emotion patterns */
  const cols = 11;
  const rows = 7;

  // "Face" landmark dots — eyes, nose, mouth curve
  const face = new Set([13, 15, 37, 44, 46, 54, 55, 56, 57, 58, 59, 60]);
  // "Contemplating" brow dots
  const brow = new Set([2, 3, 4, 7, 8, 9]);

  return (
    <div style={{ position: "relative", height: 150, overflow: "hidden", background: "rgba(255,95,31,0.03)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 8,
        padding: "0 16px",
        width: "100%",
      }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const isFace = face.has(i);
          const isBrow = brow.has(i);
          return (
            <motion.div
              key={i}
              style={{ width: 6, height: 6, borderRadius: "50%", justifySelf: "center" }}
              animate={{
                backgroundColor: isFace
                  ? "var(--accent)"
                  : isBrow
                  ? "rgba(255,95,31,0.5)"
                  : "rgba(237,230,214,0.1)",
                scale: isFace ? 1.3 : 1,
                opacity: isFace ? 1 : isBrow ? 0.6 : 0.2,
              }}
              transition={{ duration: 0.6, delay: i * 0.015, ease: "easeOut" }}
            />
          );
        })}
      </div>

      <div style={{ position: "absolute", bottom: 10, right: 14, fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
        26 classes
      </div>
    </div>
  );
}

/* ─── Hero headline ──────────────────────────────────────────── */

function HeroHeadline() {
  return (
    <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(3.6rem, 9vw, 9.5rem)", letterSpacing: "-0.04em", lineHeight: 0.92 }}>
      {heroLines.map((line, i) => (
        <div key={i} style={{ overflow: "hidden", display: "block" }}>
          <motion.div
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.13 }}
            style={{ color: line.color, display: "block" }}
          >
            {line.text}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ─── Reveal heading ─────────────────────────────────────────── */

function RevealHeading({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: "105%", opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={style}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Project card ───────────────────────────────────────────── */

const cardVisuals = { veris: VerisVisual, sukku: SukkuVisual, emotion: EmotionVisual };

function ProjectCard({ project, index }: { project: typeof featuredProjects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { scramble, reset } = useScramble(project.name, 500);
  const Visual = cardVisuals[project.visual];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <Magnetic strength={0.08}>
        <motion.article
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => scramble(nameRef.current)}
          onMouseLeave={() => reset(nameRef.current)}
          style={{ background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          {/* Visual header */}
          <Visual />

          {/* Text body */}
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="num-tag">{project.num}</span>
              {project.status === "live"
                ? <span className="status-live">Active</span>
                : <span className="tag">Research</span>}
            </div>

            <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--fg)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              <span ref={nameRef}>{project.name}</span>
            </h3>

            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.65, flex: 1 }}>
              {project.desc}
            </p>

            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>View project</span>
                <ArrowUpRight size={12} />
              </div>
            </div>
          </div>
        </motion.article>
      </Magnetic>
    </motion.div>
  );
}

/* ─── Research question ─────────────────────────────────────── */

function QuestionRow({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      style={{ display: "flex", gap: 16, padding: "28px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}
    >
      {/* Large question number */}
      <span style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "clamp(2.5rem, 4vw, 4rem)", color: "var(--border-hover)",
        lineHeight: 1, flexShrink: 0, minWidth: "2.5rem",
        letterSpacing: "-0.04em",
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", opacity: 0.7 }}>
          Open question
        </span>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.6vw, 1.3rem)", color: "var(--fg-muted)", lineHeight: 1.55 }}>
          {text}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Stats ──────────────────────────────────────────────────── */

function StatItem({ num, label, sub, index }: { num: string; label: string; sub: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 0 0 0" }}
    >
      {/* Thin accent bar above number */}
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: 40 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 + 0.3 }}
        style={{ height: 2, background: "var(--accent)", borderRadius: 1 }}
      />

      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(4rem, 8vw, 8rem)", color: "var(--fg)", lineHeight: 0.85, letterSpacing: "-0.04em" }}>
        {num}
      </span>
      <div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg)", lineHeight: 1.4, marginBottom: 4 }}>{label}</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-subtle)" }}>{sub}</p>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  const manifestoRef = useRef<HTMLElement>(null);
  const manifestoInView = useInView(manifestoRef, { once: true, margin: "-100px" });

  const pad = "clamp(1.5rem, 4vw, 2.5rem)";

  return (
    <div className="grain" style={{ background: "var(--bg)", color: "var(--fg)", overflowX: "hidden" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "flex-end", position: "relative", overflow: "hidden",
          padding: `7rem ${pad} 5rem`,
          scale: heroScale,
        }}
      >
        {/* Dot grid background */}
        <HeroDotGrid />

        {/* Ember orbs */}
        <motion.div style={{ y: orbY, position: "absolute", top: "-5%", right: "-15%", width: "min(900px, 120vw)", height: "min(900px, 120vw)", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,95,31,0.12) 0%, rgba(255,95,31,0.04) 45%, transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, width: "100%", margin: "0 auto" }}>

          {/* Live signal row */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}
          >
            <span className="status-live" style={{ fontSize: 10 }}>Building</span>
            <div style={{ height: 1, width: 60, background: "var(--border)" }} />
            <span className="label" style={{ color: "var(--fg-subtle)" }}>Portfolio — 2025</span>
          </motion.div>

          <div style={{ marginBottom: 36 }}>
            <HeroHeadline />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.72 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.15rem)", color: "var(--fg-muted)", maxWidth: "44ch", lineHeight: 1.75, marginBottom: 44 }}
          >
            CS student from Gurugram building at the intersection of AI and human emotion.
            10+ hackathons. 5 active systems. One direction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.88 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <Magnetic strength={0.25}>
              <Link href="/projects" className="btn-primary">
                <span>View Work</span><ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link href="/about" className="btn-outline"><span>About me</span></Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ position: "absolute", bottom: 40, left: pad, display: "flex", alignItems: "center", gap: 10 }}
        >
          <div style={{ width: 1, height: 44, background: "var(--fg-subtle)" }} />
          <span className="label" style={{ writingMode: "vertical-rl", color: "var(--fg-subtle)" }}>Scroll</span>
        </motion.div>
      </motion.section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div className="marquee-outer" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "14px 0" }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "0 22px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fg-muted)", whiteSpace: "nowrap" }}>
              {item}
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── CURRENTLY BUILDING ────────────────────────────────── */}
      <section style={{ padding: `clamp(5rem,10vw,8rem) ${pad}`, maxWidth: 1280, margin: "0 auto" }}>
        <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 20 }}>01 — Currently Building</p>
        <RevealHeading style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--fg)", lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: "clamp(3rem,6vw,5rem)", maxWidth: "20ch" }}>
          Systems at the edge of what&apos;s possible
        </RevealHeading>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
          {featuredProjects.map((p, i) => (
            <Link key={p.name} href="/projects" style={{ textDecoration: "none" }}>
              <ProjectCard project={p} index={i} />
            </Link>
          ))}
        </div>
      </section>

      {/* ── RESEARCH QUESTIONS ────────────────────────────────── */}
      <section style={{ background: "var(--surface-2)", padding: `clamp(5rem,10vw,8rem) ${pad}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 20 }}>02 — Open Questions</p>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {researchQs.map((q, i) => <QuestionRow key={i} text={q} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section style={{ padding: `clamp(5rem,10vw,8rem) ${pad}`, borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: "clamp(3rem,5vw,4rem)" }}>03 — By the numbers</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(3rem,6vw,5rem)" }}>
            {[
              { num: "10+", label: "Hackathons won", sub: "across India — 2023–2025" },
              { num: "5",   label: "Systems building", sub: "in active development right now" },
              { num: "3",   label: "Research domains", sub: "AI · Hardware · Web3" },
            ].map((s, i) => <StatItem key={i} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────── */}
      <motion.section
        ref={manifestoRef}
        style={{ padding: `clamp(6rem,12vw,11rem) ${pad}`, background: "var(--surface)", position: "relative", overflow: "hidden" }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", overflow: "hidden", pointerEvents: "none", paddingRight: pad }}>
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(6rem,22vw,22rem)", color: "transparent", WebkitTextStroke: "1px rgba(237,230,214,0.04)", letterSpacing: "-0.04em", whiteSpace: "nowrap", userSelect: "none" }}>
            Execute
          </span>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 32 }}>04 — Manifesto</p>

          <RevealHeading style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(3.5rem,8vw,8rem)", color: "var(--fg)", lineHeight: 0.88, letterSpacing: "-0.04em", marginBottom: 40 }}>
            Not exploring.
            <br />
            <span style={{ color: "var(--accent)" }}>Executing.</span>
          </RevealHeading>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.4vw,1.1rem)", color: "var(--fg-muted)", maxWidth: "52ch", lineHeight: 1.8, marginBottom: 40 }}
          >
            Building Veris, Sukku, and a research direction I&apos;ve already chosen.
            The gap between my vision and my execution isn&apos;t a weakness — it&apos;s the engine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          >
            <Magnetic strength={0.2}>
              <Link href="/projects" className="btn-primary">
                <span>See all projects</span><ArrowUpRight size={14} />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
