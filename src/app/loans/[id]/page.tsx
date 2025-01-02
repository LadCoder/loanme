import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Currency } from "~/app/_components/ui/currency";
import { getStatusDisplay } from "~/utils/loan";
import { formatDate } from "~/utils/date";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { LoanPaymentHistory } from "~/app/_components/loans/loan-payment-history";
import { LoanActions } from "~/app/_components/loans/loan-actions";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function LoanPage({ params }: PageProps) {
    const { userId } = await auth();
    if (!userId) return notFound();

    const { id } = await params;
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
        <div className="container mx-auto space-y-6 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Loan Details</h1>
                <div className="flex items-center gap-4">
                    <LoanActions
                        loanId={loan.id}
                        status={loan.status}
                        isLender={userId === loan.lenderId}
                        isBorrower={userId === loan.borrowerId}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Loan Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <Currency amount={loan.amount} currency={loan.currency} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span>{getStatusDisplay(loan.status)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Date</span>
                            <span>{loan.startDate ? formatDate(loan.startDate) : "Not started"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span>{loan.duration} months</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Schedule</span>
                            <span className="capitalize">{loan.preferredSchedule?.toLowerCase()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Payment Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly Payment</span>
                            <Currency
                                amount={Math.round(loan.amount / loan.duration)}
                                currency={loan.currency}
                            />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Payments</span>
                            <span>{loan.duration}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Remaining Payments</span>
                            <span>{loan.duration}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 bg-muted/50">
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LoanPaymentHistory loanId={loan.id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 