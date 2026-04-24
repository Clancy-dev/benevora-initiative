// app/admin/usersLogs/page.tsx
import React from "react";
import { getAllActivity } from "@/actions/activity-actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { ActivityLogsTable } from "@/components/activity-logs-table";


const defaultAvatar =
  "https://res.cloudinary.com/dbm0tkc3n/image/upload/v1773924504/no_photo_pgl4oj.png";

export default async function UsersLogsPage() {
  // ✅ Check session
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

// Full Page Protection for only those who are admins only
 // FULL 404 for non-admins
  if (session.user.role !== "ADMIN") {
    notFound(); // <-- this makes it look like the page does not exist
  }

  // Fetch all activity logs
  let activityData = { total: 0, activityLogs: [] as any[] };
  try {
    activityData = await getAllActivity(1, 1000); // fetch first 1000 for example
  } catch (err: any) {
    console.error("Failed to fetch activity logs:", err.message);
    return (
      <main className="min-h-screen p-6 bg-gray-50">
        <p className="text-red-600 font-bold">
          Failed to load activity logs: {err.message}
        </p>
      </main>
    );
  }

  const { activityLogs } = activityData;

  // Helper to get link for certain actions
  const getLinkForAction = (log: any) => {
  if (!log.metadata) return null;

  const meta = log.metadata;

  // Check receipts
  if (meta.receiptId) {
    // If action is delete
    if (log.action.toLowerCase().includes("delete")) {
      return `/dashboard/receipt/recieptlogs/view/${meta.receiptId}?deleted=true`;
    }

    // If action is edit
    if (log.action.toLowerCase().includes("edit")) {
      return `/dashboard/receipt/receiptlogs/view/${meta.receiptId}`;
    }

    // Default view
    return `/dashboard/receipt/receiptlogs/view/${meta.receiptId}`;
  }

  if (meta.companyId) return `/company-settings/${meta.companyId}`;
  if (meta.targetUserId) return `/admin/users/${meta.targetUserId}`;

  return null;
};

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Activity Logs
          </h1>
          <p className="text-muted-foreground">
            Monitor all user activities across the platform
          </p>
        </div>

        {activityLogs.length === 0 ? (
          <div className="p-8 rounded-lg bg-card border border-border text-center">
            <p className="text-muted-foreground">No activity logs found.</p>
          </div>
        ) : (
          <ActivityLogsTable logs={activityLogs} />
        )}
      </div>
    </main>
  );
}
