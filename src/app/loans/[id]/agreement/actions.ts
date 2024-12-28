'use server';

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { agreements, loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAgreement(
    loanId: number,
    data: {
        interestRate: number;
        paymentSchedule: string;
        terms: string;
    }
) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Check if the user is the lender of the loan
    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) {
        throw new Error("Loan not found");
    }

    if (loan.lenderId !== userId) {
        throw new Error("You are not authorized to create an agreement for this loan");
    }

    // Create the agreement
    const agreement = await db.insert(agreements).values({
        loanId,
        interestRate: data.interestRate,
        paymentSchedule: data.paymentSchedule,
        terms: data.terms,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    // Update the loan status
    await db.update(loans)
        .set({ status: "PENDING", updatedAt: new Date() })
        .where(eq(loans.id, loanId));

    revalidatePath(`/loans/${loanId}`);
    return agreement[0];
} 