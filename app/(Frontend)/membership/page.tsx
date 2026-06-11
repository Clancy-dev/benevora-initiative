import { Footer } from '@/components/Footer'
import { MiniHero } from '@/components/MiniHero'
import { Header } from '@/components/front-header'
import { getAllMembershipBanners } from '@/actions/banner-actions/membership'
import MembershipApplicantForm from '@/components/frontend-components/membership-form/membership-form'

export default async function MembershipPage() {
  const result = await getAllMembershipBanners()
  const banner = result.success ? result.data?.[0] : null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <main className="flex-1">
        {/* Mini Hero */}
        <MiniHero
            image={banner?.image ?? '/membership.jpg'}
            title={banner?.title ?? 'Join Our Community'}
            subtitle={banner?.subtitle ?? 'Be Part of the Change'}
        />

        {/* Why Join Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-balance">
                Why Join Benevora Initiative?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-center">
                Become part of a dynamic community dedicated to empowering lives and inspiring change. Whether you want to volunteer, donate, or partner with us, there&apos;s a role for you.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Make Real Impact</h3>
                <p className="text-muted-foreground">
                  Your contributions directly help communities transform lives and achieve sustainable development.
                </p>
              </div>

              <div className="p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Build Network</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded individuals and organizations working towards social good.
                </p>
              </div>

              <div className="p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Personal Growth</h3>
                <p className="text-muted-foreground">
                  Develop new skills, gain experience, and grow personally while contributing to meaningful causes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Types */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">
              Choose Your Role
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-lg border border-primary/20 hover:border-primary transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">Volunteer</h3>
                <p className="text-muted-foreground mb-6">
                  Donate your time, skills, and passion to make a direct difference in communities we serve.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Field support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Event organization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Skill sharing
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-lg border border-primary/20 hover:border-primary transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">Donor</h3>
                <p className="text-muted-foreground mb-6">
                  Support our programs financially to enable sustainable impact and expand our reach.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Regular giving
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Project funding
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Tax benefits
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-lg border border-primary/20 hover:border-primary transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">Partner</h3>
                <p className="text-muted-foreground mb-6">
                  Collaborate with us on strategic initiatives for mutual growth and impact.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Strategic collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Co-programs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Visibility & impact
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Applicant Form */}
        <MembershipApplicantForm/>
        
      </main>

      <Footer />
    </div>
  )
}
