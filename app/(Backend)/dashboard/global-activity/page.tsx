import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function page() {   
    //Protect the page
     const session = await getServerSession(authOptions);
    
      if (!session) {
        redirect("/login");
      }
    //

  return (
    <div>
      Global Activity
    </div>
  )
}
