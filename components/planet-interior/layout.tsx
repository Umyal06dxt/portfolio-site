'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
  bgColor: string
  planetName: string
}

export function PlanetInteriorLayout({ children, bgColor, planetName }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
      style={{ backgroundColor: bgColor, minHeight: '100vh' }}
      className="text-white"
    >
      {/* Fixed navigation */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-white/50 hover:text-white/90 text-sm font-[Manrope] tracking-widest uppercase transition-colors duration-200"
        >
          ← orbit
        </Link>
        <span className="text-white/30 text-xs font-[Manrope] tracking-widest uppercase">
          {planetName}
        </span>
      </div>

      {/* Content with staggered entrance */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      >
        <div className="pt-24 pb-24">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
