import { PlanetInteriorLayout } from '@/components/planet-interior/layout'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata = {
  title: 'Design System — Umyal Dixit',
  description: 'A precise, minimal component system.',
}

export default function DesignSystemPage() {
  return (
    <PlanetInteriorLayout bgColor="#0A0A0A" planetName="Design System">
      <ComingSoon
        title="Design System"
        tagline="A precise, minimal component system."
        accentColor="#E8E8E8"
      />
    </PlanetInteriorLayout>
  )
}
