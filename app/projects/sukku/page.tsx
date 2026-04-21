import { PlanetInteriorLayout } from '@/components/planet-interior/layout'

export const metadata = {
  title: 'Sukku — Umyal Dixit',
  description: "An AI that doesn't just respond — it understands, remembers, and lives alongside you.",
}

export default function SukkuPage() {
  return (
    <PlanetInteriorLayout bgColor="#1A0A00" planetName="Sukku">
      <div className="max-w-2xl mx-auto px-8 space-y-20">

        {/* Hero statement */}
        <section>
          <h1
            className="text-5xl md:text-6xl font-[Syne] font-light leading-tight text-white/90"
            style={{ letterSpacing: '-0.02em' }}
          >
            An AI that doesn&apos;t just respond — it understands, remembers, and lives alongside you.
          </h1>
        </section>

        {/* What it is */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            What it is
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Sukku is a hybrid AI companion system — not an assistant, not a chatbot.
            It combines emotional intelligence, real-world awareness, persistent memory, and
            proactive assistance into something closer to a presence than a product.
          </p>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Where most AI reacts to commands, Sukku observes, understands context, and initiates.
            It knows how you feel. It remembers your life. It acts before you ask.
          </p>
        </section>

        {/* Why I built it */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            Why I built it
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Every AI tool I used felt like using a calculator — powerful but cold, reactive but blind.
            I wanted to build the thing I actually wanted to exist: a system that extends human
            cognition without requiring you to operate it like software.
          </p>
        </section>

        {/* Technical depth */}
        <section className="space-y-6">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            What&apos;s technically interesting
          </h2>

          <div className="space-y-4">
            <div className="border-l-2 border-[#FF6B2B]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">Multimodal input</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Sukku reads facial expressions, voice tone, and environmental context simultaneously.
                Built on the same emotion recognition pipeline as Emotion AI.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B2B]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">Memory architecture</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Long-term episodic memory with user-controlled recall. &ldquo;Sukku, remember this moment&rdquo;
                stores it semantically — retrievable by emotion, context, or time.
              </p>
            </div>

            <div className="border-l-2 border-[#FF6B2B]/30 pl-6">
              <h3 className="text-white/80 font-[Manrope] font-medium mb-1">Hybrid privacy model</h3>
              <p className="text-white/50 font-[Manrope] text-base leading-relaxed">
                Sensitive data stays local. Heavy inference routes to cloud only when necessary.
                Privacy is not a setting — it&apos;s the default architecture.
              </p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="space-y-4">
          <h2 className="text-xs font-[Manrope] tracking-widest uppercase text-[#FF6B2B]">
            Status
          </h2>
          <p className="text-white/70 text-lg font-[Manrope] leading-relaxed">
            Software is complete and running. Hardware — the embodied form that lets Sukku
            follow, interact, and exist physically — is in development.
            The mind is built. The body is catching up.
          </p>
        </section>

        {/* CTA */}
        <section className="pt-4">
          <a
            href="https://github.com/Umyal06dxt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-[#FF6B2B]/40 hover:border-[#FF6B2B] text-[#FF6B2B] hover:text-white px-6 py-3 font-[Manrope] text-sm tracking-widest uppercase transition-all duration-300"
          >
            View on GitHub →
          </a>
        </section>

      </div>
    </PlanetInteriorLayout>
  )
}
