import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardData } from "@/actions/dashboard-actions";
import { GreetingSection } from "@/components/dashboard/greeting-section";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueSelectorCard } from "@/components/dashboard/revenue-selector-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopCustomersChart } from "@/components/dashboard/top-customers-chart";
// import { PaymentMethodsChart } from "@/components/dashboard/payment-methods-chart";
import { SlowPayingClients } from "@/components/dashboard/slow-paying-clients";
import { PaymentMethodsChart } from "@/components/dashboard/payment-methods";

export const metadata = {
  title: 'Dashboard - Receipt Manager',
  description: 'Your receipt management dashboard with analytics and insights',
};

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-muted rounded-lg animate-pulse lg:col-span-2" />
        <div className="h-80 bg-muted rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-muted rounded-lg animate-pulse" />
      </div>
      <div className="h-96 bg-muted rounded-lg animate-pulse" />
    </div>
  );
}

async function DashboardContent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const firstName = session?.user?.firstName ?? "";
  const role = session?.user?.role ?? "";

  const data = await getDashboardData();
  const { metrics, trends, topCustomers, paymentMethods, slowClients } = data;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <div className="space-y-8">
      <GreetingSection greeting={getGreeting()} firstName={firstName} role={role} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Receipts"
          value={metrics.totalReceipts.toString()}
          subtitle="All time"
          icon="📄"
          variant="default"
        />
        <MetricCard
          title="Pending Payments"
          value={formatCurrency(metrics.totalPendingPayments)}
          subtitle="Total remaining"
          icon="⏳"
          variant="highlight"
        />
        <RevenueSelectorCard
          todayRevenue={metrics.todayRevenue}
          weekRevenue={metrics.weekRevenue}
          monthRevenue={metrics.monthRevenue}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-80 bg-muted rounded-lg animate-pulse" />}>
            <RevenueChart data={trends} />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-80 bg-muted rounded-lg animate-pulse" />}>
          <TopCustomersChart data={topCustomers} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div className="h-80 bg-muted rounded-lg animate-pulse" />}>
          <PaymentMethodsChart data={paymentMethods} />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse" />}>
        <SlowPayingClients data={slowClients} />
      </Suspense>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}
