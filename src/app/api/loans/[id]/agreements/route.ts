import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans, agreements } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
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

        // Get all agreements for this loan, ordered by version
        const fetchedAgreements = await db
            .select()
            .from(agreements)
            .where(eq(agreements.loanId, loanId))
            .orderBy(desc(agreements.version));

        return NextResponse.json({ agreements: fetchedAgreements });
    } catch (error) {
        console.error("[LOAN_AGREEMENTS]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
} 