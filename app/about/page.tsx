"use client";

import Navbar from "@/components/navbar";
import AvatarScene from "@/components/avatar-scene";

const techStack = [
  "React", "Next.js", "Three.js", "Python", "Node.js",
  "Tailwind", "WebGL/GLSL", "Figma", "MongoDB", "AI/LLMs",
];

const timeline = [
  {
    year: "2026",
    title: "Creative Engineer @ Freelance",
    description: "Building Awwwards-level interfaces and AI-driven products for global clients.",
    stack: ["React", "Three.js", "Next.js"],
  },
  {
    year: "2025",
    title: "AI Learning Platform",
    description: "Built a live video-based learning system for children with real-time AI tutors.",
    stack: ["Next.js", "Python", "AI"],
  },
  {
    year: "2024",
    title: "Genco — Anon Chat App",
    description: "Designed a community app with anonymous chat and AI-driven moderation.",
    stack: ["React Native", "Python", "MongoDB"],
  },
  {
    year: "2024",
    title: "Portfolio v1",
    description: "First personal portfolio — where it all started.",
    stack: ["HTML", "CSS", "JS"],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="pt-14 min-h-screen flex flex-col md:flex-row">

        {/* Left column */}
        <div className="w-full md:w-[340px] flex-shrink-0 bg-[#080808] border-r border-white/[0.06] p-8 flex flex-col gap-8">
          <div>
            <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Identity</span>
          </div>

          {/* Avatar */}
          <div className="w-full aspect-square max-w-[260px] mx-auto">
            <AvatarScene mode="card" interactive={false} />
          </div>

          {/* Stats */}
          <div className="flex gap-6 font-mono text-[11px] text-white/50 uppercase tracking-widest">
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black font-display">3+</span>
              <span>Years</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black font-display">12+</span>
              <span>Projects</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-xl font-black font-display">5+</span>
              <span>Clients</span>
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Stack</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 border border-white/10 font-mono text-[10px] text-white/60 uppercase tracking-widest hover:border-[#E85002] hover:text-[#E85002] transition-colors cursor-default"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 p-8 md:p-16 flex flex-col gap-12">

          <div>
            <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Who I Am</span>
          </div>

          <h2 className="font-display font-black text-4xl md:text-6xl leading-[0.95] uppercase tracking-tighter">
            ENGINEER WITH A <span className="text-[#E85002]">DESIGNER&apos;S</span> HEART.
          </h2>

          <p className="font-mono text-sm text-white/50 leading-relaxed max-w-xl">
            {"// "} I build interfaces that live at the edge of engineering and art.
            Based in Delhi, IN — working globally. Focused on fluid UI, real-time 3D,
            and AI-native products that people actually remember.
          </p>

          {/* Timeline */}
          <div>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">Timeline</p>
            <div className="flex flex-col gap-8">
              {timeline.map((entry) => (
                <div key={entry.year + entry.title} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] text-[#E85002] tracking-widest w-10 pt-1">{entry.year}</span>
                    <div className="w-px flex-1 bg-white/[0.06] mt-2" />
                  </div>
                  <div className="pb-8">
                    <h3 className="font-display font-bold text-lg uppercase tracking-tight text-white group-hover:text-[#E85002] transition-colors">
                      {entry.title}
                    </h3>
                    <p className="font-mono text-xs text-white/40 mt-1 leading-relaxed">{entry.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.stack.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] font-mono text-[9px] text-white/40 uppercase tracking-widest">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
