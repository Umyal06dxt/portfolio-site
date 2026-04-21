type Props = {
  title: string
  tagline: string
  accentColor: string
}

export function ComingSoon({ title, tagline, accentColor }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-8 space-y-8">
      <h1
        className="text-5xl md:text-6xl font-[Syne] font-light leading-tight text-white/90"
        style={{ letterSpacing: '-0.02em' }}
      >
        {tagline}
      </h1>
      <p
        className="text-sm font-[Manrope] tracking-widest uppercase"
        style={{ color: accentColor, opacity: 0.7 }}
      >
        Full case study coming in Phase 2
      </p>
    </div>
  )
}
