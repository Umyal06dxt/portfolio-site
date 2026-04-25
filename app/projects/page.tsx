"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
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
  github?: string;
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
    github: "https://github.com/Umyal06dxt",
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
    github: "https://github.com/Umyal06dxt",
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
      "Deep learning system classifying 26 complex human facial emotions from images, with active research into model depth optimization, better activation functions, and attention mechanisms. Research-grade, not just implementation.",
    impact:
      "The scientific foundation for Sukku's emotional awareness. Built from first principles up, not from an API down. The research layer beneath the product layer.",
    tech: ["PyTorch", "TensorFlow", "OpenCV", "Attention Mechanisms", "Python"],
    github: "https://github.com/Umyal06dxt",
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
      "Python-based computer vision system for wound analysis using image processing and OCR integration. Analyzes wounds from images and reads contextual information — deployable on low-cost devices for remote diagnosis.",
    impact:
      "Not a CRUD app. Not a clone. A system with actual diagnostic potential that could help someone who doesn't have a doctor nearby.",
    tech: ["Python", "OpenCV", "OCR", "Image Processing", "FastAPI"],
    github: "https://github.com/Umyal06dxt",
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
      "Arduino-based floating solar panel with sun-tracking using sensors and servos, designed for renewable energy capture in ocean environments. Full firmware in C++ controlling the mechanical tracking system.",
    impact:
      "Proves full-system thinking — from hardware sensor to firmware to real-world deployment. Most CS students have never touched a circuit board. This is the other end of the stack.",
    tech: ["Arduino", "C++", "Servo Control", "Solar", "Raspberry Pi", "Sensors"],
    github: "https://github.com/Umyal06dxt",
    year: "2024",
  },
];

function StatusBadge({ status, label }: { status: Project["status"]; label: string }) {
  if (status === "live") return <span className="status-live">{label}</span>;
  if (status === "research")
    return (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--accent)", opacity: 0.75 }}>
        {label}
      </span>
    );
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--fg-subtle)" }}>
      {label}
    </span>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid var(--border)",
        borderLeft: hovered ? "2px solid var(--accent)" : "2px solid transparent",
        background: hovered ? "var(--surface)" : "transparent",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div className="px-6 md:px-10 py-12">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-start gap-5">
            <span className="num-tag shrink-0" style={{ paddingTop: 8 }}>{project.num}</span>
            <div>
              <h2
                className="display-md"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                  color: "var(--fg)",
                  lineHeight: 0.9,
                  marginBottom: 12,
                }}
              >
                {project.name}
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: "var(--fg-muted)", maxWidth: "52ch", lineHeight: 1.5 }}>
                {project.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="label hidden md:block">{project.year}</span>
            <StatusBadge status={project.status} label={project.statusLabel} />
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--fg-subtle)", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--fg-subtle)"; }}
              >
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Two-column body */}
        <div className="md:pl-[calc(1.25rem+1.5rem)] grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="label mb-3" style={{ color: "var(--fg-subtle)" }}>The Problem</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.75 }}>{project.problem}</p>
          </div>
          <div>
            <p className="label mb-3" style={{ color: "var(--fg-subtle)" }}>The Approach</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.75 }}>{project.approach}</p>
          </div>
        </div>

        {/* Impact callout */}
        <div
          className="md:pl-[calc(1.25rem+1.5rem)] mb-8"
        >
          <div
            style={{
              background: "var(--accent-dim)",
              borderLeft: "2px solid var(--accent)",
              padding: "16px 20px",
            }}
          >
            <p className="label mb-1" style={{ color: "var(--accent)", opacity: 0.8 }}>Why it matters</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.7 }}>{project.impact}</p>
          </div>
        </div>

        {/* Tech tags */}
        <div className="md:pl-[calc(1.25rem+1.5rem)] flex flex-wrap gap-2">
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

      {/* Header */}
      <header className="px-6 md:px-10 pt-36 pb-16 max-w-7xl mx-auto">
        <motion.p
          className="label mb-6"
          style={{ color: "var(--fg-subtle)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          05 projects — 2024 → present
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
          Work
        </motion.h1>

        <motion.div
          className="hr mt-14"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ transformOrigin: "left" }}
        />
      </header>

      {/* Project rows */}
      <main>
        {projects.map((p, i) => (
          <ProjectRow key={p.num} project={p} index={i} />
        ))}
      </main>

      {/* Closing */}
      <section ref={closingRef} className="px-6 md:px-10 py-28 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={closingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <p
              className="display-md mb-3"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "var(--fg-muted)" }}
            >
              More systems in progress.
              <br />
              The work never stops.
            </p>
            <p className="label" style={{ color: "var(--fg-subtle)" }}>23+ repositories on GitHub</p>
          </div>
          <a
            href="https://github.com/Umyal06dxt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 shrink-0"
            style={{
              border: "1px solid var(--border)",
              color: "var(--fg-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--accent)";
              el.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border)";
              el.style.color = "var(--fg-muted)";
            }}
          >
            <Github size={14} />
            github.com/Umyal06dxt
            <ArrowUpRight size={12} />
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
