'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// ============================
// TYPES
// ============================

export type RevenueTrend = {
  period: string
  today: number
  week: number
  month: number
}

export type TopCustomer = {
  name: string
  totalRevenue: number
}

export type PaymentMethod = {
  method: string
  count: number
  percentage: number
}

export type SlowPayingClient = {
  id: string
  name: string
  amount: number
  daysOverdue: number
}

// ============================
// DASHBOARD DATA
// ============================

export async function getDashboardData() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const userId = session.user.id

  const receipts = await prisma.receipt.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })

  const now = new Date()

  // =========================
  // 1. METRICS
  // =========================

  const totalReceipts = receipts.length

  const totalPendingPayments = receipts.reduce(
    (sum, r) => sum + r.remainingBalance,
    0
  )

  const totalRevenue = receipts.reduce(
    (sum, r) => sum + r.amountPaid,
    0
  )

  // =========================
  // 2. TIME FILTERS
  // =========================

  const todayReceipts = receipts.filter(r =>
    new Date(r.createdAt).toDateString() === now.toDateString()
  )

  const weekReceipts = receipts.filter(r => {
    const diff = (now.getTime() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7
  })

  const monthReceipts = receipts.filter(r => {
    const d = new Date(r.createdAt)
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  })

  const todayRevenue = todayReceipts.reduce((sum, r) => sum + r.amountPaid, 0)
  const weekRevenue = weekReceipts.reduce((sum, r) => sum + r.amountPaid, 0)
  const monthRevenue = monthReceipts.reduce((sum, r) => sum + r.amountPaid, 0)

  // =========================
  // 3. REVENUE TRENDS (REAL)
  // =========================

  const trendsMap: Record<string, number> = {}

  receipts.forEach(r => {
    const date = new Date(r.createdAt).toLocaleDateString()

    if (!trendsMap[date]) {
      trendsMap[date] = 0
    }

    trendsMap[date] += r.amountPaid
  })

  const trends: RevenueTrend[] = Object.entries(trendsMap).map(([date, total]) => ({
    period: date,
    today: total,
    week: total,
    month: total,
  }))

  // =========================
  // 4. TOP CUSTOMERS
  // =========================

  const customerMap: Record<string, number> = {}

  receipts.forEach(r => {
    const name = r.customerName || r.customerOrganization || "Unknown"

    if (!customerMap[name]) {
      customerMap[name] = 0
    }

    customerMap[name] += r.amountPaid
  })

  const topCustomers: TopCustomer[] = Object.entries(customerMap)
    .map(([name, totalRevenue]) => ({ name, totalRevenue }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)

  // =========================
  // 5. PAYMENT METHODS
  // =========================

  const methodMap: Record<string, number> = {}

  receipts.forEach(r => {
    const method = r.paymentMethod || "Unknown"

    if (!methodMap[method]) {
      methodMap[method] = 0
    }

    methodMap[method] += 1
  })

  const totalMethods = receipts.length || 1 // avoid division by zero

  const paymentMethods: PaymentMethod[] = Object.entries(methodMap).map(
    ([method, count]) => ({
      method,
      count,
      percentage: Math.round((count / totalMethods) * 100),
    })
  )

  // =========================
  // 6. SLOW PAYING CLIENTS
  // =========================

  const slowClients: SlowPayingClient[] = receipts
    .filter(r => r.remainingBalance > 0)
    .map(r => {
      const created = new Date(r.createdAt)

      const diffTime = now.getTime() - created.getTime()
      const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      return {
        id: r.id,
        name: r.customerName || r.customerOrganization || "Unknown",
        amount: r.remainingBalance,
        daysOverdue,
      }
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue)

  // =========================
  // RETURN EVERYTHING
  // =========================

  return {
    metrics: {
      totalReceipts,
      totalPendingPayments,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
    },
    trends,
    topCustomers,
    paymentMethods,
    slowClients,
  }
}