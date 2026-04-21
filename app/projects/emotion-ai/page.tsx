import { PlanetInteriorLayout } from '@/components/planet-interior/layout'

export const metadata = {
  title: 'Emotion AI — Umyal Dixit',
  description: 'Multimodal emotion recognition — video, audio, text — at 98% accuracy.',
}

export default function EmotionAIPage() {
  return (
    <PlanetInteriorLayout bgColor="#060D1A" planetName="Emotion AI">
      <div className="max-w-2xl mx-auto px-8 space-y-20">

        {/* Hero */}
        <section>
          <h1
            className="text-5xl md:text-6xl font-[Syne] font-light leading-tight text-white/90"
            style={{ letterSpacing: '-0.02em' }}
          >
            Multimodal emotion recognition — video, audio, text — at 98% accuracy.
          </h1>
        </section>

        {/* What it is */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#4A90E2]">
            What it is
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            A real-time emotion recognition system that reads facial expressions, vocal tone,
            and text sentiment simultaneously — then fuses them into a unified emotional state.
            Not just &ldquo;happy or sad&rdquo; — nuanced, continuous, multi-axis output.
          </p>
        </section>

        {/* Why I built it */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#4A90E2]">
            Why I built it
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Sukku needed to understand emotions. I couldn&apos;t find an existing system
            that was accurate, real-time, and multi-modal — so I built the foundation myself.
            This project became the emotional awareness layer that every AI companion needs.
          </p>
        </section>

        {/* Technical depth */}
        <section className="space-y-6">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#4A90E2]">
            What&apos;s technically interesting
          </h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#4A90E2]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">PyTorch multimodal pipeline</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Three parallel encoders — visual (CNN on facial landmarks), audio (LSTM on mel-spectrograms),
                text (transformer embeddings) — fused by an attention mechanism that weights each modality
                based on confidence. Low-confidence audio doesn&apos;t drag down high-confidence visual.
              </p>
            </div>

            <div className="border-l-2 border-[#4A90E2]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">98% accuracy on AffectNet</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Trained on AffectNet (450k images) + RAVDESS (audio) + custom dataset.
                The fusion model outperforms any single modality by 6–12% on ambiguous emotional states.
              </p>
            </div>

            <div className="border-l-2 border-[#4A90E2]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">AWS deployment</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Inference runs on EC2 g4dn instances. SageMaker endpoint with auto-scaling.
                Average latency: 180ms per frame at 720p input. Handles concurrent streams.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-4 flex gap-4 flex-wrap">
          <a
            href="https://github.com/Umyal06dxt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-[#4A90E2]/40 hover:border-[#4A90E2] text-[#4A90E2] hover:text-white px-6 py-3 font-[Manrope] text-sm tracking-widest uppercase transition-all duration-300"
          >
            GitHub →
          </a>
        </section>

      </div>
    </PlanetInteriorLayout>
  )
}
