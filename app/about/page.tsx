"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const questions = [
  "Can a machine recognize the difference between a smile that means happiness and a smile that means pain?",
  "Can we build AI companions that people actually trust — not because they're programmed to seem trustworthy, but because they've earned it through consistent emotional intelligence?",
  "In a world where any image can be faked, what does it mean to prove something is real?",
  "How do we build systems that don't just respond to humans — but adapt to them, remember them, and grow with them?",
];

const capabilities = [
  {
    title: "Intelligent Systems",
    body: "Deep learning, model optimization, computer vision, NLP, emotion modeling — the full AI pipeline from research to deployment.",
  },
  {
    title: "Full-Stack Thinking",
    body: "From Arduino circuits to React frontends to blockchain verification layers — I build across every level of a system.",
  },
  {
    title: "Human-Centered Design",
    body: "I don't just engineer features — I think about how people feel when they use something. That's the UX instinct underneath all my technical work.",
  },
  {
    title: "Leading & Communicating",
    body: "I can stand in front of a room and make it understand why an idea matters. That's rarer than any technical skill.",
  },
];

const techStack = [
  "JavaScript", "TypeScript", "Python", "C/C++",
  "React", "Next.js", "Node.js", "PyTorch",
  "TensorFlow", "OpenCV", "Docker", "Firebase",
  "MongoDB", "Arduino", "Raspberry Pi", "Figma", "Three.js",
];

/* Abstract dot-grid "face" — pure CSS, no images */
function DotGrid() {
  const rows = 10;
  const cols = 14;
  // Which dots are "lit" — approximating a face heatmap pattern
  const lit = new Set([
    14, 15, 18, 19,
    28, 29, 32, 33,
    43, 44, 48, 49,
    57, 60, 61, 62,
    70, 77,
    84, 91,
    99, 104,
    114, 115, 116, 117, 118,
  ]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 10,
        padding: "2rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: lit.has(i) ? "var(--accent)" : "var(--border-hover)",
            opacity: lit.has(i) ? 1 : 0.4,
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

function QuestionRow({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="flex items-start gap-4 py-7"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          color: "var(--accent)",
          lineHeight: 1,
          flexShrink: 0,
          paddingTop: 4,
        }}
      >
        —
      </span>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(1.05rem, 1.8vw, 1.4rem)",
          color: "var(--fg-muted)",
          lineHeight: 1.55,
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

function CapabilityRow({ cap, index }: { cap: typeof capabilities[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="flex items-start gap-5 py-7"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="dot-accent shrink-0 mt-2" />
      <div>
        <h3
          className="display-md mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
            color: "var(--fg)",
          }}
        >
          {cap.title}
        </h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.7, maxWidth: "56ch" }}>
          {cap.body}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const visionRef = useRef<HTMLDivElement>(null);
  const visionInView = useInView(visionRef, { once: true, margin: "-80px" });
  const contactRef = useRef<HTMLDivElement>(null);
  const contactInView = useInView(contactRef, { once: true, margin: "-80px" });

  return (
    <div className="grain" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <Navbar />

      {/* ── Page header ─────────────────────────────────────── */}
      <header className="px-6 md:px-10 pt-36 pb-16 max-w-7xl mx-auto">
        <motion.p
          className="label mb-6"
          style={{ color: "var(--fg-subtle)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Umyal Dixit — Gurugram, India
        </motion.p>

        <motion.h1
          className="display-xl"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4.5rem, 10vw, 10rem)",
            color: "var(--fg)",
            lineHeight: 0.88,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.07 }}
        >
          About
        </motion.h1>

        <motion.div
          className="hr mt-14"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ transformOrigin: "left" }}
        />
      </header>

      {/* ── Intro — 2 col ───────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-16 md:gap-20">
          {/* Text */}
          <div className="space-y-7">
            {[
              "I'm Umyal. I'm a CS student, but what I'm really studying is the space between human minds and intelligent systems — because I believe the most important design problem of our time isn't how to make AI more powerful. It's how to make it understand a human.",
              "I grew up thinking differently about problems. Not asking 'how do I solve this?' but 'why does this exist, and what does the world look like once it's gone?' That instinct led me into AI, into emotion research, into hardware, into blockchain — not because I was chasing trends, but because each of those fields held a piece of an answer I was looking for.",
              "I build things that sit at the edge of what's technically possible and what's humanly meaningful. I research emotion classification in machines. I'm building a system to prove that photographs are real in a world drowning in fakes. I host events, speak in public, lead teams, and stay up too late thinking about things that don't have names yet.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.15 }}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                  color: "var(--fg-muted)",
                  lineHeight: 1.8,
                }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Abstract dot-grid visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="hidden md:block"
          >
            <DotGrid />
            <p className="label mt-4 text-center" style={{ color: "var(--fg-subtle)" }}>
              26-class emotion space
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Research questions ──────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <p className="label mb-8" style={{ color: "var(--fg-subtle)" }}>
          The questions I&apos;m trying to answer
        </p>
        <div className="hr mb-2" />
        {questions.map((q, i) => (
          <QuestionRow key={i} text={q} index={i} />
        ))}
      </section>

      {/* ── Technical capabilities ──────────────────────────── */}
      <section
        className="px-6 md:px-10 py-20 w-full"
        style={{ background: "var(--surface-2)" }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="label mb-8" style={{ color: "var(--fg-subtle)" }}>
            What I can build
          </p>
          <div className="hr mb-2" />
          {capabilities.map((cap, i) => (
            <CapabilityRow key={cap.title} cap={cap} index={i} />
          ))}

          {/* Tech tag cloud */}
          <div className="mt-16">
            <p className="label mb-6" style={{ color: "var(--fg-subtle)" }}>Stack</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision ──────────────────────────────────────────── */}
      <section
        ref={visionRef}
        className="px-6 md:px-10 py-32 max-w-7xl mx-auto relative overflow-hidden"
      >
        {/* Large ambient background text */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(5rem, 22vw, 22rem)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(237,230,214,0.03)",
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
            }}
          >
            Execute
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="label mb-8" style={{ color: "var(--fg-subtle)" }}>Where I&apos;m going</p>

          <h2
            className="display-xl mb-10"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 7vw, 7.5rem)",
              color: "var(--fg)",
              lineHeight: 0.9,
            }}
          >
            Not exploring.
            <br />
            <span style={{ color: "var(--accent)" }}>Executing.</span>
          </h2>

          <div className="space-y-6 max-w-[60ch]">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: "var(--fg-muted)", lineHeight: 1.8 }}>
              Five years from now, I want to be in a research environment — maybe MIT Media Lab, maybe my own company, maybe somewhere that doesn't exist yet — working on the hardest problems at the intersection of AI and human experience. I want to hold patents on ideas that change how machines understand people.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: "var(--fg-muted)", lineHeight: 1.8 }}>
              Right now, I'm building the foundation. Veris. Sukku. The emotion model. The hardware projects. These aren't just portfolio pieces — they're proof of concept for a career and a research direction I've already chosen.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Contact callout ──────────────────────────────────── */}
      <section
        ref={contactRef}
        className="px-6 md:px-10 py-24 w-full"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="display-md mb-10"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
                color: "var(--fg)",
                maxWidth: "46ch",
                lineHeight: 1.3,
              }}
            >
              If you&apos;re working on something at the edge of AI and human experience — or just want to think out loud about hard problems — I want to hear from you.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { label: "umyal06dixit@gmail.com", href: "mailto:umyal06dixit@gmail.com" },
                { label: "github.com/Umyal06dxt", href: "https://github.com/Umyal06dxt" },
                { label: "linkedin.com/in/umyal-dixit", href: "https://linkedin.com/in/umyal-dixit" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 w-fit"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    color: "var(--fg-muted)",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"; }}
                >
                  {link.label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
