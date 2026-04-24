import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getMyActivity } from "@/actions/activity-actions";
import { redirect } from "next/navigation";
import { ActivityLogsFilter } from "@/components/activity-logs-filter";

export default async function MyActivityPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if no session
  if (!session || !session.user) {
    redirect("/login");
  }

  // At this point, TypeScript knows session.user exists
  const { activityLogs } = await getMyActivity(session.user.id);



  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          My Activity
        </h1>

        <ActivityLogsFilter activityLogs={activityLogs} />
      </div>
    </main>
  );
}
