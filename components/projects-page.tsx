"use client";

import Footer from "@/components/footer";
import Magnetic from "@/components/magnetic";
import Navbar from "@/components/navbar";
import { useScramble } from "@/hooks/use-scramble";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useRef, useState } from "react";

interface Project {
  num: string;
  name: string;
  status: "live" | "research" | "completed";
  statusLabel: string;
  tagline: string;
  problem: string;
  approach: string;
  impact: string;
  tech: string[];
  year: string;
}

const projects: Project[] = [
  {
    num: "01",
    name: "Veris",
    status: "live",
    statusLabel: "In Development",
    tagline: "Hardware proof that a photograph is real.",
    problem:
      "We live in the age of deepfakes and AI-generated imagery. The ability to trust a photograph is becoming one of the most critical infrastructure problems of our time. Most detection tools analyze after the fact — too late.",
    approach:
      "Hardware-first proof of authenticity — trust is embedded at the moment of capture, not verified later. A physical device combined with Web3's immutable ledger creates a chain of custody for visual truth that cannot be faked.",
    impact:
      "Journalism, law, security, and AI ethics all need this. It changes how courts handle evidence, how newsrooms verify images, and how humans navigate a world of synthetic media.",
    tech: ["Web3", "Blockchain", "Hardware", "Computer Vision", "Raspberry Pi"],
    year: "2025 →",
  },
  {
    num: "02",
    name: "Sukku",
    status: "live",
    statusLabel: "In Development",
    tagline: "An AI companion that doesn't just respond — it notices.",
    problem:
      "Every AI assistant is reactive. It waits for a command and executes it. Siri, Alexa, Google — all the same pattern. Nobody has built AI that's genuinely proactive, emotionally aware, and contextually intelligent in daily life.",
    approach:
      "Fusing Computer Vision (spatial awareness, child safety, object memory), NLP (natural conversation), Edge AI (on-device processing for privacy), and Behavioral Modeling (learning patterns over time) into one coherent, living system.",
    impact:
      "Most AI is built for utility. Sukku is built for connection. It remembers where you left your keys. It senses your mood. It learns your rhythms. It's what AI companionship should actually feel like.",
    tech: ["Edge AI", "NLP", "Computer Vision", "Behavioral Modeling", "React", "Node.js", "PyTorch"],
    year: "2025 →",
  },
  {
    num: "03",
    name: "Emotion Classification Model",
    status: "research",
    statusLabel: "Research",
    tagline: "Teaching machines to read faces the way humans do.",
    problem:
      "Every beginner ML project classifies 6 basic emotions. Real human emotional reality has 26+ complex states — contempt, awe, confusion, embarrassment — the ones that are hard even for humans to name.",
    approach:
      "Deep learning system classifying 26 complex human facial emotions from images, with active research into model depth optimization, better activation functions, and attention mechanisms.",
    impact:
      "The scientific foundation for Sukku's emotional awareness. Built from first principles up, not from an API down.",
    tech: ["PyTorch", "TensorFlow", "OpenCV", "Attention Mechanisms", "Python"],
    year: "2024 →",
  },
  {
    num: "04",
    name: "Wound Sensor",
    status: "completed",
    statusLabel: "Completed",
    tagline: "Computer vision for medical diagnosis, deployable anywhere.",
    problem:
      "Healthcare and AI rarely meet at the point of care, especially in countries where medical resources are unevenly distributed. Remote diagnosis is still mostly a promise, not a product.",
    approach:
      "Python-based computer vision system for wound analysis using image processing and OCR integration. Analyzes wounds from images — deployable on low-cost devices for remote diagnosis.",
    impact:
      "Not a CRUD app. Not a clone. A system with actual diagnostic potential that could help someone who doesn't have a doctor nearby.",
    tech: ["Python", "OpenCV", "OCR", "Image Processing", "FastAPI"],
    year: "2024",
  },
  {
    num: "05",
    name: "Floating Solar Panel",
    status: "completed",
    statusLabel: "Completed",
    tagline: "Renewable energy hardware that tracks the sun.",
    problem:
      "Renewable energy capture needs smarter hardware that adapts to its environment. Static solar panels waste capacity. Ocean environments are underutilized.",
    approach:
      "Arduino-based floating solar panel with sun-tracking using sensors and servos, designed for renewable energy capture in ocean environments. Full firmware in C++.",
    impact:
      "Proves full-system thinking — from hardware sensor to firmware to real-world deployment. Most CS students have never touched a circuit board.",
    tech: ["Arduino", "C++", "Servo Control", "Solar", "Raspberry Pi", "Sensors"],
    year: "2024",
  },
];

/* ─── Project visuals ───────────────────────────────────────── */

function VerisVisual() {
  const hexPoints = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");

  const hexes = [
    { cx: 76, cy: 44 }, { cx: 116, cy: 44 }, { cx: 156, cy: 44 },
    { cx: 56, cy: 76 }, { cx: 96, cy: 76 }, { cx: 136, cy: 76 }, { cx: 176, cy: 76 },
    { cx: 76, cy: 108 }, { cx: 116, cy: 108 }, { cx: 156, cy: 108 },
  ];

  return (
    <div style={{ position: "relative", width: 200, height: 130, flexShrink: 0 }}>
      <svg width="200" height="130" viewBox="0 0 200 130" fill="none">
        {hexes.map((h, i) => (
          <motion.polygon
            key={i}
            points={hexPoints(h.cx, h.cy, 16)}
            stroke="rgba(255,95,31,0.3)"
            strokeWidth="1"
            fill="rgba(255,95,31,0.05)"
            animate={{ opacity: [0.3, 0.85, 0.3], fill: ["rgba(255,95,31,0.03)", "rgba(255,95,31,0.1)", "rgba(255,95,31,0.03)"] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </svg>
      {/* Scan line */}
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: 1.5,
          background: "linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)",
          opacity: 0.9,
        }}
        animate={{ top: ["-5%", "110%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
      />
      <span className="label" style={{ position: "absolute", bottom: 0, right: 4, color: "var(--accent)", opacity: 0.55, fontSize: 8 }}>
        CHAIN-OF-CUSTODY
      </span>
    </div>
  );
}

function SukkuVisual() {
  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            border: "1px solid var(--accent)",
          }}
          animate={{
            width: [28 + i * 22, 28 + i * 22 + 14],
            height: [28 + i * 22, 28 + i * 22 + 14],
            opacity: [0.55 - i * 0.1, 0],
          }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
        />
      ))}
      <motion.div
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--accent)",
        }}
        animate={{
          scale: [1, 1.6, 1],
          boxShadow: ["0 0 0 0 rgba(255,95,31,0.5)", "0 0 0 10px rgba(255,95,31,0)", "0 0 0 0 rgba(255,95,31,0)"],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="label" style={{ position: "absolute", bottom: 0, right: 4, color: "var(--accent)", opacity: 0.55, fontSize: 8 }}>
        PROXIMITY DETECTED
      </span>
    </div>
  );
}

function EmotionVisual() {
  const cols = 9;
  const rows = 6;
  const total = cols * rows;
  const lit = new Set([10, 11, 16, 17, 19, 20, 27, 28, 35, 36, 37, 38, 43, 44]);
  const brow = new Set([1, 2, 5, 6]);
  return (
    <div style={{ position: "relative", width: 160, height: 130, flexShrink: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 7, padding: 10 }}>
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            style={{ width: 7, height: 7, borderRadius: "50%" }}
            animate={
              lit.has(i)
                ? { backgroundColor: "var(--accent)", scale: 1.5, opacity: 1 }
                : brow.has(i)
                  ? { backgroundColor: "rgba(255,95,31,0.45)", scale: 1, opacity: 0.7 }
                  : { backgroundColor: "rgba(237,230,214,0.09)", scale: 1, opacity: 0.5 }
            }
            transition={{ duration: 0.5, delay: i * 0.014, ease: "easeOut" }}
          />
        ))}
      </div>
      <span className="label" style={{ position: "absolute", bottom: 0, right: 4, color: "var(--accent)", opacity: 0.55, fontSize: 8 }}>
        26 CLASSES
      </span>
    </div>
  );
}

function WoundVisual() {
  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="42" stroke="rgba(255,95,31,0.15)" strokeWidth="1" />
        <circle cx="60" cy="60" r="28" stroke="rgba(255,95,31,0.25)" strokeWidth="1" />
        <circle cx="60" cy="60" r="14" stroke="rgba(255,95,31,0.35)" strokeWidth="1" />
        <line x1="60" y1="6" x2="60" y2="30" stroke="rgba(255,95,31,0.4)" strokeWidth="1" />
        <line x1="60" y1="90" x2="60" y2="114" stroke="rgba(255,95,31,0.4)" strokeWidth="1" />
        <line x1="6" y1="60" x2="30" y2="60" stroke="rgba(255,95,31,0.4)" strokeWidth="1" />
        <line x1="90" y1="60" x2="114" y2="60" stroke="rgba(255,95,31,0.4)" strokeWidth="1" />
        <motion.circle
          cx="60" cy="60" r="4"
          fill="var(--accent)"
          animate={{ r: [4, 6, 4], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 60 18 A 42 42 0 0 1 102 60"
          stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" fill="none"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 60px" }}
        />
      </svg>
      <span className="label" style={{ position: "absolute", bottom: 0, right: 4, color: "var(--accent)", opacity: 0.55, fontSize: 8 }}>
        ANALYZING
      </span>
    </div>
  );
}

function SolarVisual() {
  return (
    <div style={{ position: "relative", width: 160, height: 130, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="150" height="115" viewBox="0 0 150 115" fill="none">
        {/* Sun */}
        <motion.circle
          cx="75" cy="26" r="11"
          fill="rgba(255,95,31,0.12)" stroke="rgba(255,95,31,0.55)" strokeWidth="1"
          animate={{ r: [11, 13, 11] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <motion.line
              key={i}
              x1={75 + 14 * Math.cos(rad)} y1={26 + 14 * Math.sin(rad)}
              x2={75 + 20 * Math.cos(rad)} y2={26 + 20 * Math.sin(rad)}
              stroke="rgba(255,95,31,0.5)" strokeWidth="1"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
            />
          );
        })}
        {/* Tracking arc */}
        <path d="M 18 92 Q 75 44 132 92" stroke="rgba(255,95,31,0.22)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Tracker dot */}
        <motion.circle r="5" fill="var(--accent)" opacity="0.9"
          animate={{ cx: [18, 75, 132], cy: [92, 52, 92] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        />
        {/* Panel */}
        <rect x="57" y="86" width="36" height="20" rx="2" fill="rgba(255,95,31,0.06)" stroke="rgba(255,95,31,0.32)" strokeWidth="1" />
        <line x1="75" y1="86" x2="75" y2="106" stroke="rgba(255,95,31,0.2)" strokeWidth="0.5" />
        <line x1="57" y1="96" x2="93" y2="96" stroke="rgba(255,95,31,0.2)" strokeWidth="0.5" />
        <line x1="75" y1="106" x2="75" y2="112" stroke="rgba(255,95,31,0.3)" strokeWidth="1.5" />
      </svg>
      <span className="label" style={{ position: "absolute", bottom: 0, right: 4, color: "var(--accent)", opacity: 0.55, fontSize: 8 }}>
        SUN-TRACKING
      </span>
    </div>
  );
}

const visuals: Record<string, React.FC> = {
  "01": VerisVisual,
  "02": SukkuVisual,
  "03": EmotionVisual,
  "04": WoundVisual,
  "05": SolarVisual,
};

/* ─── Page title ────────────────────────────────────────────── */
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
        Work
      </motion.h1>
    </div>
  );
}

/* ─── Status badge ──────────────────────────────────────────── */
function StatusBadge({ status, label }: { status: Project["status"]; label: string }) {
  if (status === "live") return <span className="status-live">{label}</span>;
  if (status === "research")
    return <span className="tag" style={{ color: "var(--accent)", borderColor: "rgba(255,95,31,0.3)" }}>{label}</span>;
  return <span className="tag">{label}</span>;
}

/* ─── Project row ───────────────────────────────────────────── */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const { scramble, reset } = useScramble(project.name, 600);
  const Visual = visuals[project.num];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="project-row"
      onMouseEnter={() => { setHovered(true); scramble(nameRef.current as HTMLElement); }}
      onMouseLeave={() => { setHovered(false); reset(nameRef.current as HTMLElement); }}
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div style={{ padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 2.5rem)" }}>
        {/* Top — title + visual */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flex: 1, minWidth: 0 }}>
            <span className="num-tag" style={{ paddingTop: 8, color: "var(--fg-subtle)", flexShrink: 0 }}>{project.num}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                className="display-md"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(2.2rem, 5.5vw, 5rem)",
                  color: "var(--fg)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  marginBottom: 12,
                }}
              >
                <span ref={nameRef as React.RefObject<HTMLSpanElement>}>{project.name}</span>
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: "var(--fg-muted)", maxWidth: "50ch", lineHeight: 1.5, marginBottom: 16 }}>
                {project.tagline}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span className="label" style={{ color: "var(--fg-subtle)" }}>{project.year}</span>
                <StatusBadge status={project.status} label={project.statusLabel} />
                <motion.div animate={{ x: hovered ? 3 : 0, y: hovered ? -3 : 0 }} transition={{ duration: 0.2 }}>
                  <a
                    href="https://github.com/Umyal06dxt"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--fg-subtle)", transition: "color 0.2s", display: "flex" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--fg-subtle)"; }}
                  >
                    <ArrowUpRight size={18} />
                  </a>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Visual — desktop only */}
          <motion.div
            className="hidden md:flex"
            style={{ flexShrink: 0, alignItems: "center", justifyContent: "center" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: hovered ? 1 : 0.45 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Visual />
          </motion.div>
        </div>

        {/* Body */}
        <div
          style={{ paddingLeft: "calc(20px + 1.25rem)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}
          className="grid-cols-responsive"
        >
          <div>
            <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 10 }}>The Problem</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.75 }}>{project.problem}</p>
          </div>
          <div>
            <p className="label" style={{ color: "var(--fg-subtle)", marginBottom: 10 }}>The Approach</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.75 }}>{project.approach}</p>
          </div>
        </div>

        {/* Impact */}
        <div style={{ paddingLeft: "calc(20px + 1.25rem)", marginBottom: 20 }}>
          <motion.div
            animate={{ borderLeftColor: hovered ? "var(--accent)" : "rgba(255,95,31,0.3)" }}
            transition={{ duration: 0.3 }}
            style={{ padding: "14px 18px", borderLeft: "2px solid rgba(255,95,31,0.3)", background: "var(--accent-dim)" }}
          >
            <p className="label" style={{ color: "var(--accent)", opacity: 0.85, marginBottom: 6 }}>Why it matters</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.7 }}>{project.impact}</p>
          </motion.div>
        </div>

        {/* Tags */}
        <div style={{ paddingLeft: "calc(20px + 1.25rem)", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {project.tech.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const closingRef = useRef<HTMLDivElement>(null);
  const closingInView = useInView(closingRef, { once: true, margin: "-80px" });

  return (
    <div className="grain" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <Navbar />

      <header style={{ padding: "clamp(8rem, 15vw, 12rem) clamp(1.5rem, 4vw, 2.5rem) clamp(3rem, 6vw, 5rem)", maxWidth: 1280, margin: "0 auto" }}>
        <motion.p
          className="label"
          style={{ color: "var(--fg-subtle)", marginBottom: 24 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          05 projects — 2024 → present
        </motion.p>
        <PageTitle />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          style={{ height: 1, background: "var(--border)", marginTop: "clamp(2rem, 4vw, 3.5rem)", transformOrigin: "left" }}
        />
      </header>

      <main>
        {projects.map((p, i) => <ProjectRow key={p.num} project={p} index={i} />)}
      </main>

      <section ref={closingRef} style={{ padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 2.5rem)", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={closingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexDirection: "column", gap: 32 }}
        >
          <p
            className="display-md"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "var(--fg-muted)" }}
          >
            More systems in progress.
            <br />
            The work never stops.
          </p>

          <Magnetic strength={0.2}>
            <a
              href="https://github.com/Umyal06dxt"
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
              style={{ alignSelf: "flex-start" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Github size={13} />
                github.com/Umyal06dxt
                <ArrowUpRight size={12} />
              </span>
            </a>
          </Magnetic>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
