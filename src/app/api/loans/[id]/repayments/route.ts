import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { loans, repayments } from "~/server/db/schema";

type RouteParams = {
    params: Promise<{ id: string }> | { id: string };
};

export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const loanId = parseInt(id);
        if (isNaN(loanId)) {
            return new NextResponse("Invalid loan ID", { status: 400 });
        }

        // Check if user has access to this loan
        const loan = await db.query.loans.findFirst({
            where: eq(loans.id, loanId),
        });

        if (!loan) {
            return new NextResponse("Loan not found", { status: 404 });
        }

        if (loan.lenderId !== userId && loan.borrowerId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get all repayments for this loan
        const loanRepayments = await db.query.repayments.findMany({
            where: eq(repayments.loanId, loanId),
            orderBy: (repayments, { desc }) => [desc(repayments.dueDate)],
        });

        return NextResponse.json({ repayments: loanRepayments });
    } catch (error) {
        console.error("[REPAYMENTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function POST(
    request: Request,
    params: Promise<{ id: string }> | { id: string }

) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const loanId = parseInt(id);
        if (isNaN(loanId)) {
            return new NextResponse("Invalid loan ID", { status: 400 });
        }

        // Check if user has access to this loan
        const loan = await db.query.loans.findFirst({
            where: eq(loans.id, loanId),
        });

        if (!loan) {
            return new NextResponse("Loan not found", { status: 404 });
        }

        // Only borrowers can make repayments
        if (loan.borrowerId !== userId) {
            return new NextResponse("Only borrowers can make repayments", { status: 403 });
        }

        const json = await request.json();
        const { amount, note } = json;

        if (!amount || typeof amount !== "number" || amount <= 0) {
            return new NextResponse("Invalid amount", { status: 400 });
        }

        // Create the repayment
        const [repayment] = await db.insert(repayments).values({
            loanId,
            amount,
            note: note || null,
            dueDate: new Date(), // For manual repayments, use current date
            paidDate: new Date(),
            status: "PAID",
        }).returning();

        return NextResponse.json({ repayment });
    } catch (error) {
        console.error("[REPAYMENTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
} 