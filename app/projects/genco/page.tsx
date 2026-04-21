import { PlanetInteriorLayout } from '@/components/planet-interior/layout'
import { ComingSoon } from '@/components/ui/coming-soon'

export const metadata = {
  title: 'Genco — Umyal Dixit',
  description: 'Anonymous chat for real conversations.',
}

export default function GencoPage() {
  return (
    <PlanetInteriorLayout bgColor="#051A18" planetName="Genco">
      <ComingSoon
        title="Genco"
        tagline="Anonymous chat for real conversations."
        accentColor="#4ECDC4"
      />
    </PlanetInteriorLayout>
  )
}
