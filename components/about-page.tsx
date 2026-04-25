"use client";

import Footer from "@/components/footer";
import Magnetic from "@/components/magnetic";
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
  { title: "Intelligent Systems", body: "Deep learning, model optimization, computer vision, NLP, emotion modeling — the full AI pipeline from research to deployment." },
  { title: "Full-Stack Thinking", body: "From Arduino circuits to React frontends to blockchain verification layers — I build across every level of a system." },
  { title: "Human-Centered Design", body: "I don't just engineer features — I think about how people feel when they use something. The UX instinct underneath all my technical work." },
  { title: "Leading & Communicating", body: "I can stand in front of a room and make it understand why an idea matters. That's rarer than any technical skill." },
];

const techStack = [
  "JavaScript", "TypeScript", "Python", "C/C++", "React",
  "Next.js", "Node.js", "PyTorch", "TensorFlow", "OpenCV",
  "Docker", "Firebase", "MongoDB", "Arduino", "Raspberry Pi", "Figma", "Three.js",
];

function PageTitle() {
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.h1
        initial={{ y: "105%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(5rem, 12vw, 12rem)",
          color: "var(--fg)",
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
        }}
      >
        About
      </motion.h1>
    </div>
  );
}

function DotGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-60px" });

  const rows = 10;
  const cols = 12;
  const total = rows * cols;
  const lit = new Set([13, 14, 17, 18, 25, 26, 29, 30, 37, 38, 43, 50, 57, 64, 74, 75, 76, 77, 78]);

  return (
    <div ref={containerRef}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 10,
          padding: "28px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const isLit = lit.has(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0.06, scale: 0.8, backgroundColor: "rgba(237,230,214,0.08)" }}
              animate={inView ? {
                opacity: isLit ? 1 : 0.12,
                scale: isLit ? 1.4 : 1,
                backgroundColor: isLit ? "var(--accent)" : "rgba(237,230,214,0.1)",
              } : {}}
              transition={{ duration: 0.4, ease: "easeOut", delay: inView ? i * 0.008 : 0 }}
              style={{ width: 7, height: 7, borderRadius: "50%" }}
            />
          );
        })}
      </div>
      <p className="label" style={{ marginTop: 12, textAlign: "center", color: "var(--fg-subtle)" }}>
        26-class emotion space
      </p>
    </div>
  );
}

function RevealHeading({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={style}
      >
        {children}
      </motion.div>
    </div>
  );
}

function QuestionRow({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      style={{ display: "flex", gap: 14, padding: "24px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}
    >
      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--accent)", lineHeight: 1, flexShrink: 0, paddingTop: 2 }}>
        —
      </span>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.6vw, 1.3rem)", color: "var(--fg-muted)", lineHeight: 1.55 }}>
        {text}
      </p>
    </motion.div>
  );
}

function CapRow({ cap, index }: { cap: typeof capabilities[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      style={{ display: "flex", gap: 18, padding: "28px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}
    >
      <span className="dot-accent" style={{ flexShrink: 0, marginTop: 10 }} />
      <div>
        <RevealHeading
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
            color: "var(--fg)",
            lineHeight: 0.95,
            marginBottom: 10,
          }}
        >
          {cap.title}
        </RevealHeading>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.75, maxWidth: "56ch" }}>
          {cap.body}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const visionRef = useRef<HTMLElement>(null);
  const visionInView = useInView(visionRef, { once: true, margin: "-80px" });
  const contactRef = useRef<HTMLElement>(null);
  const contactInView = useInView(contactRef, { once: true, margin: "-80px" });

  const pad = "clamp(1.5rem, 4vw, 2.5rem)";
  const secPad = `clamp(5rem, 10vw, 8rem) ${pad}`;

  return (
    <div className="grain" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <Navbar />

      <header style={{ padding: `clamp(8rem, 15vw, 12rem) ${pad} clamp(3rem, 6vw, 5rem)`, maxWidth: 1280, margin: "0 auto" }}>
        <motion.p
          className="label"
          style={{ color: "var(--fg-subtle)", marginBottom: 24 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Umyal Dixit — Gurugram, India
        </motion.p>
        <PageTitle />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          style={{ height: 1, background: "var(--border)", marginTop: "clamp(2rem, 4vw, 3.5rem)", transformOrigin: "left" }}
        />
      </header>

      <section style={{ padding: `clamp(3rem, 6vw, 5rem) ${pad}`, maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(3rem, 6vw, 5rem)", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              "I'm Umyal. I'm a CS student, but what I'm really studying is the space between human minds and intelligent systems — because I believe the most important design problem of our time isn't how to make AI more powerful. It's how to make it understand a human.",
              "I grew up thinking differently about problems. Not asking 'how do I solve this?' but 'why does this exist, and what does the world look like once it's gone?' That instinct led me into AI, into emotion research, into hardware, into blockchain — not because I was chasing trends, but because each of those fields held a piece of an answer I was looking for.",
              "I build things that sit at the edge of what's technically possible and what's humanly meaningful. I research emotion classification in machines. I'm building a system to prove that photographs are real in a world drowning in fakes. I host events, speak in public, lead teams, and stay up too late thinking about things that don't have names yet.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.14 }}
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.15rem)", color: "var(--fg-muted)", lineHeight: 1.85 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{ minWidth: 260 }}
            className="hidden md:block"
          >
            <DotGrid />
          </motion.div>
        </div>
      </section>

      <section style={{ padding: secPad, maxWidth: 1280, margin: "0 auto" }}>
        <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 24 }}>The Questions I&apos;m Trying To Answer</p>
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {questions.map((q, i) => <QuestionRow key={i} text={q} index={i} />)}
        </div>
      </section>

      <section style={{ background: "var(--surface-2)", padding: secPad }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 24 }}>What I Can Build</p>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {capabilities.map((cap, i) => <CapRow key={cap.title} cap={cap} index={i} />)}
          </div>

          <div style={{ marginTop: "clamp(3rem, 5vw, 4rem)" }}>
            <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 16 }}>Stack</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {techStack.map((t) => (
                <motion.span
                  key={t}
                  className="tag"
                  whileHover={{ borderColor: "var(--accent)", color: "var(--accent)", y: -2 }}
                  transition={{ duration: 0.15 }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <motion.section
        ref={visionRef}
        style={{ padding: `clamp(6rem, 12vw, 11rem) ${pad}`, maxWidth: 1280, margin: "0 auto", position: "relative", overflow: "hidden" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <span style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(5rem, 24vw, 24rem)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(237,230,214,0.035)",
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}>
            Execute
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 32 }}>Where I&apos;m Going</p>

          <RevealHeading
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(3rem, 8vw, 8rem)",
              color: "var(--fg)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              marginBottom: 40,
            }}
          >
            Not exploring.
            <br />
            <span style={{ color: "var(--accent)" }}>Executing.</span>
          </RevealHeading>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: "58ch", marginBottom: 44 }}>
            {[
              "Five years from now, I want to be in a research environment — maybe MIT Media Lab, maybe my own company, maybe somewhere that doesn't exist yet — working on the hardest problems at the intersection of AI and human experience.",
              "Right now, I'm building the foundation. Veris. Sukku. The emotion model. The hardware projects. These aren't just portfolio pieces — they're proof of concept for a career and a research direction I've already chosen.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={visionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.15 }}
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: "var(--fg-muted)", lineHeight: 1.85 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={contactRef}
        style={{ padding: secPad, background: "var(--surface)", borderTop: "1px solid var(--border)" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <RevealHeading
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
                color: "var(--fg)",
                maxWidth: "44ch",
                lineHeight: 1.25,
                marginBottom: 44,
              }}
            >
              If you&apos;re working on something at the edge of AI and human experience — or just want to think out loud about hard problems — I want to hear from you.
            </RevealHeading>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "umyal06dixit@gmail.com", href: "mailto:umyal06dixit@gmail.com" },
                { label: "github.com/Umyal06dxt", href: "https://github.com/Umyal06dxt" },
                { label: "linkedin.com/in/umyal-dixit", href: "https://linkedin.com/in/umyal-dixit" },
              ].map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.1 }}
                >
                  <Magnetic strength={0.15}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "var(--fg-muted)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"; }}
                    >
                      {link.label}
                      <ArrowUpRight size={13} />
                    </a>
                  </Magnetic>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
