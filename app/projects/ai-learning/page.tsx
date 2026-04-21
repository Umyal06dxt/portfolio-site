import { PlanetInteriorLayout } from '@/components/planet-interior/layout'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata = {
  title: 'AI Learning — Umyal Dixit',
  description: 'Real-time AI tutors that adapt to every learner.',
}

export default function AILearningPage() {
  return (
    <PlanetInteriorLayout bgColor="#1A1400" planetName="AI Learning">
      <ComingSoon
        title="AI Learning"
        tagline="Real-time AI tutors that adapt to every learner."
        accentColor="#FFD166"
      />
    </PlanetInteriorLayout>
  )
}
