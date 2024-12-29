'use server';

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { agreements, loans } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAgreement(
    loanId: number,
    data: {
        interestRate: number;
        paymentSchedule: string;
        terms: string;
        latePaymentFee: number;
        gracePeriod: number;
        allowEarlyRepayment: boolean;
        earlyRepaymentFee: number;
        defaultInterestRate: number;
        defaultNoticePeriod: number;
        hasCollateral: boolean;
        collateralDescription?: string;
        collateralValue?: number;
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

    // Get the latest version of any existing agreement
    const latestAgreement = await db.query.agreements.findFirst({
        where: eq(agreements.loanId, loanId),
        orderBy: [desc(agreements.version)],
    });

    // Create the agreement
    const agreement = await db.insert(agreements).values({
        loanId,
        interestRate: data.interestRate,
        paymentSchedule: data.paymentSchedule as "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY",
        terms: data.terms,
        status: "PENDING",
        version: latestAgreement ? latestAgreement.version + 1 : 1,
        previousVersionId: latestAgreement?.id,

        // Late Payment Terms
        latePaymentFee: data.latePaymentFee,
        gracePeriod: data.gracePeriod,

        // Early Repayment Terms
        allowEarlyRepayment: data.allowEarlyRepayment,
        earlyRepaymentFee: data.earlyRepaymentFee,

        // Default Terms
        defaultInterestRate: data.defaultInterestRate,
        defaultNoticePeriod: data.defaultNoticePeriod,

        // Collateral Information
        hasCollateral: data.hasCollateral,
        collateralDescription: data.collateralDescription,
        collateralValue: data.collateralValue,

        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    // Update the loan status
    await db.update(loans)
        .set({ status: "PENDING", updatedAt: new Date() })
        .where(eq(loans.id, loanId));

    revalidatePath(`/loans/${loanId}`);
    revalidatePath(`/loans/${loanId}/agreement`);
    return agreement[0];
}

export async function acceptAgreement(agreementId: number) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const agreement = await db.query.agreements.findFirst({
        where: eq(agreements.id, agreementId),
        with: {
            loan: true,
        },
    });

    if (!agreement) {
        throw new Error("Agreement not found");
    }

    if (!agreement.loan) {
        throw new Error("Loan not found");
    }

    if (agreement.loan.borrowerId !== userId) {
        throw new Error("Only the borrower can accept the agreement");
    }

    if (agreement.status !== "PENDING") {
        throw new Error("Agreement must be pending to accept");
    }

    // Update the agreement
    await db.transaction(async (tx) => {
        await tx.update(agreements)
            .set({
                status: "ACCEPTED",
                signedByBorrower: true,
                signedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(agreements.id, agreementId));

        await tx.update(loans)
            .set({
                status: "ACTIVE",
                startDate: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(loans.id, agreement.loan.id));
    });

    revalidatePath(`/loans/${agreement.loan.id}`);
    revalidatePath(`/loans/${agreement.loan.id}/agreement`);
}

export async function rejectAgreement(agreementId: number) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const agreement = await db.query.agreements.findFirst({
        where: eq(agreements.id, agreementId),
        with: {
            loan: true,
        },
    });

    if (!agreement) {
        throw new Error("Agreement not found");
    }

    if (!agreement.loan) {
        throw new Error("Loan not found");
    }

    if (agreement.loan.borrowerId !== userId) {
        throw new Error("Only the borrower can reject the agreement");
    }

    if (agreement.status !== "PENDING") {
        throw new Error("Agreement must be pending to reject");
    }

    // Update the agreement
    await db.transaction(async (tx) => {
        await tx.update(agreements)
            .set({
                status: "REJECTED",
                updatedAt: new Date(),
            })
            .where(eq(agreements.id, agreementId));

        await tx.update(loans)
            .set({
                status: "PENDING",
                updatedAt: new Date(),
            })
            .where(eq(loans.id, agreement.loan.id));
    });

    revalidatePath(`/loans/${agreement.loan.id}`);
    revalidatePath(`/loans/${agreement.loan.id}/agreement`);
} 