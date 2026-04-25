"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

/* ─── Data ──────────────────────────────────────────────────── */

const marqueeItems = [
  "10× Hackathon Winner",
  "AI Researcher",
  "Gurugram, India",
  "CS Student",
  "Hardware Builder",
  "Public Speaker",
  "Late-night Builder",
  "System Thinker",
];

interface Project {
  name: string;
  status: "live" | "research";
  statusLabel: string;
  tagline: string;
  tags: string[];
}

const projects: Project[] = [
  {
    name: "VERIS",
    status: "live",
    statusLabel: "In development",
    tagline: "Hardware proof that a photograph is real. Built for an age of deepfakes.",
    tags: ["Web3", "Blockchain", "Hardware", "CV"],
  },
  {
    name: "SUKKU",
    status: "live",
    statusLabel: "In development",
    tagline: "An AI companion that doesn't just respond — it notices.",
    tags: ["Edge AI", "NLP", "Computer Vision", "Behavioral Modeling"],
  },
  {
    name: "EMOTION AI",
    status: "research",
    statusLabel: "Research",
    tagline: "Classifying 26 complex human emotions from a single face.",
    tags: ["Deep Learning", "PyTorch", "Attention"],
  },
];

const questions = [
  "Can a machine recognize the difference between a smile that means happiness and a smile that means pain?",
  "Can we build AI companions that people trust — not because they're programmed to seem trustworthy, but because they earned it?",
  "In a world where any image can be faked, what does it mean to prove something is real?",
  "How do we build systems that don't just respond to humans — but adapt to them, remember them, and grow with them?",
];

/* ─── Framer Motion variants ─────────────────────────────────── */

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.11,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* ─── Word-split helper ──────────────────────────────────────── */

function AnimatedWords({
  text,
  baseDelay = 0,
  className = "",
}: {
  text: string;
  baseDelay?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={baseDelay + i}
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          className={`inline-block ${className}`}
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

/* ─── Section label ──────────────────────────────────────────── */

function SectionLabel({ children, num }: { children: string; num: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="num-tag">{num}</span>
      <span className="dot-accent" />
      <span className="label">{children}</span>
    </div>
  );
}

/* ─── Project card ───────────────────────────────────────────── */

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col justify-between p-7 min-h-[300px] snap-start shrink-0 w-[80vw] md:w-auto"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        transition: "border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Arrow — appears on hover */}
      <motion.div
        className="absolute top-6 right-6"
        initial={{ opacity: 0, x: -4, y: 4 }}
        whileHover={{ opacity: 1, x: 0, y: 0 }}
        style={{ color: "var(--accent)" }}
      >
        <ArrowUpRight size={18} />
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* Project name */}
        <h3
          className="display-md text-clamp-md leading-none"
          style={{ color: "var(--fg)" }}
        >
          {project.name}
        </h3>

        {/* Tagline */}
        <p
          className="text-sm leading-relaxed max-w-xs"
          style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
        >
          {project.tagline}
        </p>
      </div>

      {/* Footer row */}
      <div className="mt-8 flex flex-col gap-3">
        {/* Status */}
        {project.status === "live" ? (
          <span className="status-live">{project.statusLabel}</span>
        ) : (
          <span
            className="font-mono text-[10px] tracking-[0.14em] uppercase"
            style={{ color: "var(--fg-subtle)" }}
          >
            {project.statusLabel}
          </span>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Research question row ──────────────────────────────────── */

function QuestionRow({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUpVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex items-start gap-4 py-6"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span
        className="shrink-0 text-2xl md:text-3xl leading-tight"
        style={{ color: "var(--fg)" }}
      >
        —
      </span>
      <p
        className="text-xl md:text-2xl lg:text-3xl leading-snug"
        style={{
          color: "var(--fg-muted)",
          fontFamily: "var(--font-body)",
          maxWidth: "72ch",
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

/* ─── Main page component ────────────────────────────────────── */

export default function LandingPage() {
  /* Parallax for hero ember glow */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  /* Stats section ref */
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px 0px" });

  /* Manifesto ref */
  const manifestoRef = useRef<HTMLDivElement>(null);
  const manifestoInView = useInView(manifestoRef, { once: true, margin: "-100px 0px" });

  return (
    <div className="grain" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ── 1. HERO ───────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col justify-center min-h-screen overflow-hidden px-6 md:px-10"
        style={{ paddingTop: "7rem", paddingBottom: "5rem" }}
      >
        {/* Ember radial glow — CSS only */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: "translateX(-50%)",
            y: glowY,
            width: "min(860px, 110vw)",
            height: "min(860px, 110vw)",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(255,95,31,0.13) 0%, rgba(255,95,31,0.04) 45%, transparent 72%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          className="relative z-10 max-w-7xl mx-auto w-full"
          style={{ maxWidth: "1280px" }}
        >
          {/* Section label */}
          <div className="mb-8 fade-up fade-up-d1">
            <span className="label">Portfolio — 2025</span>
          </div>

          {/* Headline — word-by-word stagger */}
          <h1 className="display-xl text-clamp-hero mb-8" style={{ color: "var(--fg)" }}>
            <span className="block">
              <AnimatedWords text="I don't just" baseDelay={0} />
            </span>
            <span className="block">
              <AnimatedWords text="build things." baseDelay={3} />
            </span>
            <span
              className="block mt-1"
              style={{ color: "var(--fg-muted)" }}
            >
              <AnimatedWords text="I imagine what" baseDelay={5} />
            </span>
            <span
              className="block"
              style={{ color: "var(--fg-muted)" }}
            >
              <AnimatedWords text="they could mean." baseDelay={7} />
            </span>
          </h1>

          {/* Intro line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg mb-12"
            style={{
              color: "var(--fg-muted)",
              fontFamily: "var(--font-body)",
              maxWidth: "56ch",
            }}
          >
            Umyal Dixit — CS student, AI researcher, system builder.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 flex-wrap"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono tracking-widest uppercase transition-all duration-200"
              style={{
                background: "var(--accent)",
                color: "#0A0A0A",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#ff7a45";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--accent)";
              }}
            >
              View Work
              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono tracking-widest uppercase transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                color: "var(--fg-muted)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-hover)";
                el.style.color = "var(--fg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--fg-muted)";
              }}
            >
              About me
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-6 md:left-10 flex items-center gap-3"
        >
          <div
            className="w-px h-12 origin-top"
            style={{ background: "var(--fg-subtle)" }}
          />
          <span className="label" style={{ writingMode: "vertical-rl" }}>
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ── 2. IDENTITY MARQUEE ──────────────────────────────────── */}
      <div
        className="marquee-outer w-full py-4"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="marquee-track">
          {/* Render twice for seamless loop */}
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-6"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {item}
              <span className="dot-accent shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. WHAT I'M BUILDING ────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-24 max-w-7xl mx-auto w-full"
        style={{ maxWidth: "1280px" }}
      >
        <SectionLabel num="01">Currently Building</SectionLabel>

        <h2
          className="display-md text-clamp-lg mb-16"
          style={{ color: "var(--fg)" }}
        >
          Systems at the edge of{" "}
          <br className="hidden md:block" />
          what&apos;s possible
        </h2>

        {/* Mobile: horizontal scroll / Desktop: 3-col grid */}
        <div
          className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      {/* ── 4. RESEARCH QUESTIONS ────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-24 w-full"
        style={{ background: "var(--surface-2)" }}
      >
        <div className="max-w-7xl mx-auto" style={{ maxWidth: "1280px" }}>
          <SectionLabel num="02">The questions I'm trying to answer</SectionLabel>

          <div className="hr mb-8" />

          {questions.map((q, i) => (
            <QuestionRow key={i} text={q} index={i} />
          ))}
        </div>
      </section>

      {/* ── 5. SELECTED WINS ─────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-24 max-w-7xl mx-auto w-full"
        style={{ maxWidth: "1280px" }}
      >
        <SectionLabel num="03">By the numbers</SectionLabel>

        <div ref={statsRef}>
          <div className="hr mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x md:divide-[var(--border)]">
            {[
              { num: "10+", label: "Hackathons won" },
              { num: "5", label: "Systems in production / active development" },
              { num: "3", label: "Research domains — AI · Hardware · Web3" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUpVariants}
                initial="hidden"
                animate={statsInView ? "visible" : "hidden"}
                className="flex flex-col gap-2 md:px-12 first:pl-0 last:pr-0"
              >
                <span
                  className="display-xl"
                  style={{
                    color: "var(--fg)",
                    fontSize: "clamp(4rem, 8vw, 8rem)",
                  }}
                >
                  {stat.num}
                </span>
                <span
                  className="text-sm leading-relaxed"
                  style={{
                    color: "var(--fg-muted)",
                    fontFamily: "var(--font-body)",
                    maxWidth: "24ch",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. MANIFESTO ─────────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-32 w-full relative overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        {/* Large ambient background text */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <span
            className="display-xl whitespace-nowrap"
            style={{
              fontSize: "clamp(5rem, 18vw, 18rem)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(237,230,214,0.04)",
              letterSpacing: "-0.04em",
            }}
          >
            EXECUTE
          </span>
        </div>

        <div
          ref={manifestoRef}
          className="relative z-10 max-w-7xl mx-auto"
          style={{ maxWidth: "1280px" }}
        >
          <SectionLabel num="04">Manifesto</SectionLabel>

          <motion.blockquote
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate={manifestoInView ? "visible" : "hidden"}
            className="display-xl text-clamp-lg mb-10"
            style={{ color: "var(--fg)" }}
          >
            &ldquo;I&rsquo;m not exploring.
            <br />
            I&rsquo;m executing.&rdquo;
          </motion.blockquote>

          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate={manifestoInView ? "visible" : "hidden"}
            className="text-base md:text-lg mb-12 leading-relaxed"
            style={{
              color: "var(--fg-muted)",
              fontFamily: "var(--font-body)",
              maxWidth: "54ch",
            }}
          >
            Building Veris, Sukku, and a research direction I&apos;ve already chosen.
            The gap between my vision and my execution is the engine.
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate={manifestoInView ? "visible" : "hidden"}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 link-underline font-mono text-sm tracking-widest uppercase"
              style={{ color: "var(--fg)" }}
            >
              See all projects
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
