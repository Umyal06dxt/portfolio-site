"use client";

import { useCallback, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function useScramble(target: string, duration = 600) {
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      const total = target.length;
      let frame = 0;
      const totalFrames = Math.ceil(duration / 40);

      if (frameRef.current) clearInterval(frameRef.current);

      frameRef.current = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const resolved = Math.floor(progress * total);

        el.textContent =
          target.substring(0, resolved) +
          Array.from({ length: total - resolved })
            .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
            .join("");

        if (frame >= totalFrames) {
          el.textContent = target;
          if (frameRef.current) clearInterval(frameRef.current);
        }
      }, 40);
    },
    [target, duration]
  );

  const reset = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      if (frameRef.current) clearInterval(frameRef.current);
      el.textContent = target;
    },
    [target]
  );

  return { scramble, reset };
}
