import { getAllDonateBanners } from '@/actions/banner-actions/donate-banner'
import DonationSection from '@/components/DonationSection'
import { Footer } from '@/components/Footer'
import { MiniHero } from '@/components/MiniHero'
import { Header } from '@/components/front-header'


export default async function Donate() {
  const result = await getAllDonateBanners()
  const banner = result.success ? result.data?.[0] : null
 
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <MiniHero
        image={banner?.image ?? '/donate-image.jpg'}
        title={banner?.title ?? 'Make a Donation'}
        subtitle={banner?.subtitle ?? 'Help Us Create Lasting Change'}
      />

      {/* Donation Section */}
      <DonationSection/>
    
      <Footer />
    </div>
  )
}
