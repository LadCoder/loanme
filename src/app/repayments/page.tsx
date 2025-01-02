import React from "react";
import { Calendar } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { loans, repayments } from "~/server/db/schema";
import { eq, or, inArray } from "drizzle-orm";
import { PageContainer } from "~/app/_components/ui/layout/page-container";
import { PageHeader } from "~/app/_components/ui/layout/page-header";
import { RepaymentsTable } from "~/app/_components/ui/data-table/repayments-table";

export default async function RepaymentsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Get all loans where user is either lender or borrower
    const userLoans = await db.query.loans.findMany({
        where: or(eq(loans.lenderId, userId), eq(loans.borrowerId, userId)),
    });

    const loanIds = userLoans.map((loan) => loan.id);

    // Get all repayments for these loans
    const allRepayments = await db.query.repayments.findMany({
        where: inArray(repayments.loanId, loanIds),
        orderBy: (repayments, { desc }) => [desc(repayments.dueDate)],
    });

    return (
        <PageContainer>
            <PageHeader
                title="Repayments"
                icon={Calendar}
                description="View all your loan repayments"
            />

            <RepaymentsTable repayments={allRepayments} />
        </PageContainer>
    );
} 