"use client";

import { Suspense } from "react";
import { api } from "~/utils/api";
import { DollarSign, Clock, BadgeCheck, AlertCircle, Ban } from "lucide-react";
import { Currency } from "~/app/_components/ui/currency";
import Link from "next/link";
import { OverviewSkeleton } from "~/app/_components/skeletons/OverviewSkeleton";

function BorrowedLoansContent() {
    const { data: borrowedLoans } = api.loan.getBorrowedLoans.useQuery(undefined, {
        suspense: true,
    });

    // Helper function to get status icon
    const getStatusIcon = (status: string) => {
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
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Borrowed Loans</h1>
            </div>

            <div className="grid gap-4">
                {borrowedLoans?.map((loan) => (
                    <Link
                        key={loan.id}
                        href={`/loans/${loan.id}`}
                        className="flex items-center justify-between rounded-lg bg-background/50 p-4 transition-colors hover:bg-background"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-md bg-primary/10 p-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div className="grid gap-1">
                                <Currency amount={loan.amount} className="text-lg font-medium leading-none" />
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(loan.status)}
                                    <span>{loan.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-1 text-right">
                            <div className="text-sm font-medium">
                                {loan.agreement ? "Agreement Signed" : "No Agreement"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Due: {loan.endDate ? new Date(loan.endDate).toLocaleDateString() : "Not set"}
                            </div>
                        </div>
                    </Link>
                ))}
                {borrowedLoans?.length === 0 && (
                    <div className="rounded-lg bg-muted p-8 text-center">
                        <h2 className="text-lg font-semibold">No borrowed loans</h2>
                        <p className="text-muted-foreground">You haven't borrowed any loans yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BorrowedLoansPage() {
    return (
        <Suspense fallback={<OverviewSkeleton />}>
            <BorrowedLoansContent />
        </Suspense>
    );
} 