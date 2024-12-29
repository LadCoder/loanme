import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Currency } from "~/app/_components/ui/currency";
import { getStatusDisplay } from "~/utils/loan";
import { formatDate } from "~/utils/date";

interface LoanDetailsProps {
    id: string;
}

export async function LoanDetails({ id }: LoanDetailsProps) {
    const { userId } = await auth();
    if (!userId) return notFound();

    const loanId = parseInt(id);
    if (isNaN(loanId)) return notFound();

    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) return notFound();

    // Ensure user has access to this loan
    if (loan.lenderId !== userId && loan.borrowerId !== userId) {
        return notFound();
    }

    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Amount</span>
                <Currency amount={loan.amount} currency={loan.currency} />
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Status</span>
                <span>{getStatusDisplay(loan.status)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Duration</span>
                <span>{loan.duration} months</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(loan.createdAt)}</span>
            </div>
            {loan.startDate && (
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>{formatDate(loan.startDate)}</span>
                </div>
            )}
            {loan.endDate && (
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span>{formatDate(loan.endDate)}</span>
                </div>
            )}
        </div>
    );
} 