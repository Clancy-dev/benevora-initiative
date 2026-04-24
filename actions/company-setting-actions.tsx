"use server"

import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { logActivity } from "@/actions/log-activity" 

export interface Contact {
  name: string
  phone: string
}

export interface CompanyInput {
  name: string
  email: string
  logo?: string
  contacts: Contact[]
}


// ============================
// GET COMPANY SETTINGS (NO LOG)
// ============================
export async function getCompanySettings() {
  try {
    const settings = await prisma.companySettings.findFirst()
    return settings
  } catch (error) {
    console.error("Failed to fetch company settings:", error)
    throw new Error("Failed to fetch company settings")
  }
}


// ============================
// CREATE COMPANY SETTINGS
// ============================
export async function createCompanySettings(data: CompanyInput) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("You must be logged in")

  try {
    const existing = await prisma.companySettings.findFirst()

    if (existing) {
      return existing
    }

    const created = await prisma.companySettings.create({
      data: {
        name: data.name,
        email: data.email,
        logo: data.logo,
        contacts: data.contacts as unknown as Prisma.InputJsonValue,
        userId: session.user.id,
        createdById: session.user.id,
      } as Prisma.CompanySettingsUncheckedCreateInput,
    })

    // ✅ LOG ACTIVITY
    await logActivity({
      userId: session.user.id,
      action: "CREATED_COMPANY_SETTINGS",
      metadata: {
        companyId: created.id,
        name: created.name,
      },
    })

    return created

  } catch (error) {
    console.error("Failed to create company settings:", error)
    throw new Error("Failed to create company settings")
  }
}


// ============================
// UPDATE COMPANY SETTINGS
// ============================
export async function updateCompanySettings(id: string, data: CompanyInput) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("You must be logged in")

  try {
    const updated = await prisma.companySettings.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        logo: data.logo,
        contacts: data.contacts as unknown as Prisma.InputJsonValue,
        updatedById: session.user.id,
      } as Prisma.CompanySettingsUncheckedUpdateInput,
    })

    // ✅ LOG ACTIVITY
    await logActivity({
      userId: session.user.id,
      action: "UPDATED_COMPANY_SETTINGS",
      metadata: {
        companyId: updated.id,
        name: updated.name,
      },
    })

    return updated

  } catch (error) {
    console.error("Failed to update company settings:", error)
    throw new Error("Failed to update company settings")
  }
}