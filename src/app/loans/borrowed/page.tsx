import Link from "next/link";
import { DollarSign, Clock, BadgeCheck, AlertCircle, Ban } from "lucide-react";
import { Currency } from "~/app/_components/ui/currency";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

function getStatusIcon(status: string) {
    switch (status.toUpperCase()) {
        case "ACTIVE":
            return <BadgeCheck className="h-4 w-4 text-success" />;
        case "PENDING":
            return <Clock className="h-4 w-4 text-warning" />;
        case "DEFAULTED":
            return <AlertCircle className="h-4 w-4 text-destructive" />;
        case "CANCELLED":
            return <Ban className="h-4 w-4 text-muted-foreground" />;
        default:
            return null;
    }
}

export default async function BorrowedLoansPage() {
    const session = await auth();
    if (!session?.userId) return null;

    const borrowedLoans = await db.query.loans.findMany({
        where: eq(loans.borrowerId, session.userId),
        orderBy: [desc(loans.createdAt)],
        limit: 50,
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Borrowed Loans</h1>
            </div>

            <div className="space-y-4">
                {borrowedLoans.map((loan) => (
                    <Link
                        key={loan.id}
                        href={`/loans/${loan.id}`}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-primary/10 p-2">
                                <DollarSign className="h-4 w-4 text-primary" />
                            </div>
                            <div className="grid gap-1">
                                <Currency amount={loan.amount} className="text-lg font-medium" />
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(loan.status)}
                                    <span>{loan.status}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {borrowedLoans.length === 0 && (
                    <div className="rounded-lg bg-muted p-8 text-center">
                        <h2 className="text-lg font-semibold">No borrowed loans</h2>
                        <p className="text-muted-foreground">You haven't borrowed any loans yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 