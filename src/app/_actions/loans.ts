"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type LoanStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "DEFAULTED" | "CANCELLED";

export async function createLoan(data: {
    amount: number;
    currency: string;
    purpose: "PERSONAL" | "BUSINESS" | "EDUCATION" | "OTHER";
    description: string;
    duration: number;
    preferredSchedule: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
    startDate?: Date;
    endDate?: Date;
    borrowerId: string;
}) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    // Look up the borrower by email
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList({
        emailAddress: [data.borrowerId],
    });

    const borrower = users.data[0];
    if (!borrower) {
        throw new Error("Borrower not found. Make sure they have an account on the platform.");
    }
    // Don't allow self-loans
    if (borrower.id === userId) {
        throw new Error("You cannot assign a loan to yourself");
    }
    const loan = await db.insert(loans).values({
        amount: data.amount,
        currency: data.currency,
        purpose: data.purpose,
        description: data.description,
        duration: data.duration,
        preferredSchedule: data.preferredSchedule,
        startDate: data.startDate,
        endDate: data.endDate,
        lenderId: userId,
        borrowerId: borrower.id,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    revalidatePath("/loans/lent");
    revalidatePath("/loans/borrowed");
    revalidatePath("/");
    return loan[0];
}

export async function startLoan(loanId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) throw new Error("Loan not found");
    if (loan.lenderId !== userId) throw new Error("Only the lender can start the loan");
    if (loan.status !== "PENDING") throw new Error("Loan must be pending to start");

    await db
        .update(loans)
        .set({
            status: "ACTIVE",
            startDate: new Date(),
        })
        .where(eq(loans.id, loanId));

    revalidatePath(`/loans/${loanId}`);
    revalidatePath("/loans/lent");
    revalidatePath("/loans/borrowed");
    revalidatePath("/");
}

export async function acceptLoan(loanId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) throw new Error("Loan not found");
    if (loan.borrowerId !== userId) throw new Error("Only the borrower can accept the loan");
    if (loan.status !== "PENDING") throw new Error("Loan must be pending to accept");

    await db
        .update(loans)
        .set({ status: "ACTIVE" })
        .where(eq(loans.id, loanId));

    revalidatePath(`/loans/${loanId}`);
    revalidatePath("/loans/lent");
    revalidatePath("/loans/borrowed");
    revalidatePath("/");
}

export async function rejectLoan(loanId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) throw new Error("Loan not found");
    if (loan.borrowerId !== userId) throw new Error("Only the borrower can reject the loan");
    if (loan.status !== "PENDING") throw new Error("Loan must be pending to reject");

    await db
        .update(loans)
        .set({ status: "CANCELLED" })
        .where(eq(loans.id, loanId));

    revalidatePath(`/loans/${loanId}`);
    revalidatePath("/loans/lent");
    revalidatePath("/loans/borrowed");
    revalidatePath("/");
}

export async function completeLoan(loanId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) throw new Error("Loan not found");
    if (loan.lenderId !== userId) throw new Error("Only the lender can complete the loan");
    if (loan.status !== "ACTIVE") throw new Error("Loan must be active to complete");

    await db
        .update(loans)
        .set({
            status: "COMPLETED",
            endDate: new Date(),
        })
        .where(eq(loans.id, loanId));

    revalidatePath(`/loans/${loanId}`);
    revalidatePath("/loans/lent");
    revalidatePath("/loans/borrowed");
    revalidatePath("/");
} 