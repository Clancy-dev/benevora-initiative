import { CompanySettingsForm } from '@/components/company-settings-form'

export const metadata = {
  title: 'Company Settings | Receipt Generator',
  description: 'Configure your company details for receipt generation',
}

export default function CompanySettingsPage() {
  return (
    <main className="min-h-screen  ">
      {/* Content */}
      <div className="container  mx-auto px-4 md:px-6 py-8 bg-white dark:bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Configure your company - Your company will appear on your receipt. </h2>
            <p className="text-muted-foreground mt-2">
              Set up your company details. These will be pre-filled in every receipt you generate.
            </p>
          </div>
          
          <CompanySettingsForm />
        </div>
      </div>
    </main>
  )
}
