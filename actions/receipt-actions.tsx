'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ReceiptFormData } from "@/types/receipt";
import { getServerSession } from "next-auth";
import { logActivity } from "@/actions/log-activity"; // ✅ IMPORT LOGGER


// ============================
// CREATE RECEIPT
// ============================
export async function createReceipt(data: ReceiptFormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");

  try {
    const receipt = await prisma.receipt.create({
      data: {
        userId: session.user.id,
        createdById: session.user.id,
        updatedById: session.user.id,

        customerOrganization: data.customerOrganization,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        clientContacts: data.clientContacts.length > 0 ? (data.clientContacts as any) : undefined,
        additionalNames: data.customerNames.length > 0 ? (data.customerNames as any) : undefined,
        additionalEmails: data.customerEmails.length > 0 ? (data.customerEmails as any) : undefined,

        projectName: data.projectName,
        serviceType: data.serviceType,
        projectStartDate: new Date(data.projectStartDate),
        projectEndDate: new Date(data.projectEndDate),
        description: data.description,

        projectTotal: data.projectTotal,
        amountPaid: data.amountPaid,
        remainingBalance: data.remainingBalance,
        currency: data.currency,

        paymentMethod: data.paymentMethod,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        cardNumber: data.cardNumber,
        mobileMoneyProvider: data.mobileMoneyProvider,
        mobileNumber: data.mobileNumber,
        countryCode: data.countryCode,

        companyName: data.companyName,
        companyEmail: data.companyEmail,
        companyLogo: data.companyLogo,
        companyContacts: data.companyContacts?.length ? (data.companyContacts as any) : undefined,
      } as Prisma.ReceiptUncheckedCreateInput,
    });

    // ✅ LOG ACTIVITY
    await logActivity({
      userId: session.user.id,
      action: "CREATED_RECEIPT",
      metadata: {
        receiptId: receipt.id,
        projectName: receipt.projectName,
        amount: receipt.projectTotal,
      },
    });

    return receipt;

  } catch (error) {
    console.error("Failed to create receipt:", error);
    throw new Error("Could not create receipt.");
  }
}


// ============================
// GET ALL RECEIPTS
// ============================
export async function getAllReceipts() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");

  try {
    const receipts = await prisma.receipt.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return receipts;

  } catch (error) {
    console.error("Failed to fetch receipts:", error);
    throw new Error("Could not fetch receipts.");
  }
}


// ============================
// GET RECEIPT BY ID (PUBLIC)
// ============================
export async function getReceiptById(id: string) {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id },
    });

    if (!receipt) throw new Error("Receipt not found");
    return receipt;

  } catch (error) {
    console.error("Failed to fetch receipt:", error);
    throw new Error("Could not fetch receipt.");
  }
}


// ============================
// UPDATE RECEIPT
// ============================
export async function updateReceipt(id: string, data: Partial<ReceiptFormData>) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");

  try {
    const receipt = await prisma.receipt.update({
      where: { id },
      data: {
        ...(data.customerOrganization && { customerOrganization: data.customerOrganization }),
        ...(data.customerName && { customerName: data.customerName }),
        ...(data.customerEmail && { customerEmail: data.customerEmail }),
        ...(data.clientContacts && { clientContacts: data.clientContacts as any }),
        ...(data.customerNames && { additionalNames: data.customerNames as any }),
        ...(data.customerEmails && { additionalEmails: data.customerEmails as any }),
        ...(data.projectName && { projectName: data.projectName }),
        ...(data.serviceType && { serviceType: data.serviceType }),
        ...(data.projectStartDate && { projectStartDate: new Date(data.projectStartDate) }),
        ...(data.projectEndDate && { projectEndDate: new Date(data.projectEndDate) }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.projectTotal !== undefined && { projectTotal: data.projectTotal }),
        ...(data.amountPaid !== undefined && { amountPaid: data.amountPaid }),
        ...(data.remainingBalance !== undefined && { remainingBalance: data.remainingBalance }),
        ...(data.currency && { currency: data.currency }),
        ...(data.paymentMethod && { paymentMethod: data.paymentMethod }),
        ...(data.bankName && { bankName: data.bankName }),
        ...(data.bankAccountNumber && { bankAccountNumber: data.bankAccountNumber }),
        ...(data.cardNumber && { cardNumber: data.cardNumber }),
        ...(data.mobileMoneyProvider && { mobileMoneyProvider: data.mobileMoneyProvider }),
        ...(data.mobileNumber && { mobileNumber: data.mobileNumber }),
        ...(data.countryCode && { countryCode: data.countryCode }),

        updatedById: session.user.id,
      } as Prisma.ReceiptUncheckedUpdateInput,
    });

    // ✅ LOG ACTIVITY
    await logActivity({
      userId: session.user.id,
      action: "UPDATED_RECEIPT",
      metadata: {
        receiptId: receipt.id,
      },
    });

    return receipt;

  } catch (error) {
    console.error("Failed to update receipt:", error);
    throw new Error("Could not update receipt.");
  }
}


// ============================
// DELETE RECEIPT
// ============================
export async function deleteReceipt(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  try {
    // Soft delete
    const receipt = await prisma.receipt.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await logActivity({
      userId: session.user.id,
      action: "DELETED_RECEIPT",
      metadata: { receiptId: id },
    });

    return receipt;

  } catch (error) {
    console.error("Failed to delete receipt:", error);
    throw new Error("Could not delete receipt.");
  }
}