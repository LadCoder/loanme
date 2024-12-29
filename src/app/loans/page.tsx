import React from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Button } from "~/app/_components/ui/button";
import { Card } from "~/app/_components/ui/card";
import { ArrowRight, ArrowLeft, PiggyBank, Clock, BadgeCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { CurrencyDisplay } from "~/app/_components/ui/currency";

export default async function LoansPage() {
    const { userId } = await auth();
    if (!userId) return null;

    // Fetch summary statistics
    const [lentLoans, borrowedLoans] = await Promise.all([
        db.query.loans.findMany({
            where: eq(loans.lenderId, userId),
            orderBy: [desc(loans.startDate)],
        }),
        db.query.loans.findMany({
            where: eq(loans.borrowerId, userId),
            orderBy: [desc(loans.startDate)],
        }),
    ]);

    // Calculate statistics
    const totalLent = lentLoans.reduce((acc, loan) => acc + loan.amount, 0);
    const totalBorrowed = borrowedLoans.reduce((acc, loan) => acc + loan.amount, 0);
    const activeLentLoans = lentLoans.filter(loan => loan.status === "ACTIVE");
    const activeBorrowedLoans = borrowedLoans.filter(loan => loan.status === "ACTIVE");
    const pendingLentLoans = lentLoans.filter(loan => loan.status === "PENDING");
    const pendingBorrowedLoans = borrowedLoans.filter(loan => loan.status === "PENDING");

    return (
        <div className="container mx-auto space-y-6 px-1 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
                <Button asChild>
                    <Link href="/loans/new">
                        <PiggyBank className="mr-2 h-4 w-4" />
                        Create New Loan
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/loans/lent" className="block">
                    <div className="rounded-xl bg-muted/50 p-6 transition-all hover:bg-muted/70">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-primary/10 p-3">
                                    <ArrowRight className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Money Lent</h3>
                                    <p className="text-sm text-muted-foreground">View loans you've given to others</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <CurrencyDisplay
                                amount={totalLent}
                                className="text-3xl font-bold tracking-tight"
                                label={
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <BadgeCheck className="h-4 w-4 text-success" />
                                            <span>{activeLentLoans.length} Active</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-warning" />
                                            <span>{pendingLentLoans.length} Pending</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                            <span>{lentLoans.length} Total</span>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </Link>

                <Link href="/loans/borrowed" className="block">
                    <div className="rounded-xl bg-muted/50 p-6 transition-all hover:bg-muted/70">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-primary/10 p-3">
                                    <ArrowLeft className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Money Borrowed</h3>
                                    <p className="text-sm text-muted-foreground">View loans you've received from others</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <CurrencyDisplay
                                amount={totalBorrowed}
                                className="text-3xl font-bold tracking-tight"
                                label={
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <BadgeCheck className="h-4 w-4 text-success" />
                                            <span>{activeBorrowedLoans.length} Active</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-warning" />
                                            <span>{pendingBorrowedLoans.length} Pending</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                            <span>{borrowedLoans.length} Total</span>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
