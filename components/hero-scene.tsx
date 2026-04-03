"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AvatarScene from "@/components/avatar-scene";

const PARTICLES = [
  { id: 1, top: "18%", left: "12%", size: 4 },
  { id: 2, top: "72%", left: "8%", size: 3 },
  { id: 3, top: "30%", left: "88%", size: 5 },
  { id: 4, top: "65%", left: "80%", size: 3 },
  { id: 5, top: "85%", left: "55%", size: 4 },
  { id: 6, top: "10%", left: "60%", size: 3 },
  { id: 7, top: "48%", left: "5%", size: 4 },
  { id: 8, top: "20%", left: "40%", size: 2 },
];

export default function HeroScene() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    const t = setInterval(update, 1000);
    update();
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">

      {/* Blueprint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Concentric reticle rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute rounded-full border border-[#E85002]/25"
          style={{ width: 340, height: 340 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full border border-[#E85002]/15"
          style={{ width: 500, height: 500 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Ambient particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#E85002]"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{
            duration: 2 + p.id * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.id * 0.2,
          }}
        />
      ))}

      {/* Corner labels */}
      <div className="absolute top-16 left-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5">
        <span>UMYAL.DEV</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#E85002] rounded-full inline-block animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="absolute top-16 right-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5 text-right">
        <span>EST. 2024</span>
        <span>v3.0</span>
      </div>
      <div className="absolute bottom-10 left-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5">
        <span>DELHI, IN</span>
        <span>{time}</span>
      </div>
      <div className="absolute bottom-10 right-6 flex flex-col font-mono text-[9px] text-white/30 tracking-widest uppercase leading-5 text-right">
        <span>CREATIVE</span>
        <span>ENGINEER</span>
      </div>

      {/* 3D Avatar (pointer-events on so cursor tracking works) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <div style={{ width: 320, height: 420 }}>
          <AvatarScene mode="hero" interactive={true} />
        </div>
      </div>

      {/* Name + tagline */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
        <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter uppercase text-white">
          UMYAL DIXIT
        </h1>
        <p className="font-mono text-[11px] text-white/40 tracking-widest">
          // Creative Engineer · Delhi, IN · Open to Work
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">SCROLL</span>
        <div className="relative w-px h-8 bg-white/10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#E85002]"
            style={{ height: "50%" }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#E85002]"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
