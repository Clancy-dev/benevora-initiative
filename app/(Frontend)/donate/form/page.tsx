import DonationForm from '@/components/DonationForm'
import { Suspense } from 'react'


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonationForm />
    </Suspense>
  )
}