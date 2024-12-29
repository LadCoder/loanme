import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans, agreements } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card } from "~/app/_components/ui/card";
import { Currency } from "~/app/_components/ui/currency";
import { getStatusDisplay } from "~/utils/loan";
import { formatDate } from "~/utils/date";
import { Button } from "~/app/_components/ui/button";
import { History, CalendarDays, Percent, Ban, Shield } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "~/app/_components/PrintButton";
import { AgreementActions } from "~/app/_components/AgreementActions";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function AgreementViewPage({ params }: PageProps) {
    const { userId } = await auth();
    if (!userId) return notFound();

    const { id } = await params;
    const loanId = parseInt(id);
    if (isNaN(loanId)) return notFound();

    // Fetch loan and agreement details
    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, loanId),
    });

    if (!loan) return notFound();

    // Ensure user has access to this loan
    if (loan.lenderId !== userId && loan.borrowerId !== userId) {
        return notFound();
    }

    // Get all agreements for this loan, ordered by version
    const agreementHistory = await db.query.agreements.findMany({
        where: eq(agreements.loanId, loanId),
        orderBy: [desc(agreements.version)],
    });

    if (agreementHistory.length === 0) return notFound();

    // The latest agreement is the first one in the history
    const agreement = agreementHistory[0];
    if (!agreement) return notFound();

    return (
        <div className="container mx-auto space-y-6 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Loan Agreement</h1>
                <div className="flex items-center gap-2">
                    {agreementHistory.length > 1 && (
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/loans/${loanId}/agreement/history`}>
                                <History className="h-4 w-4" />
                                <span className="sr-only">View Agreement History</span>
                            </Link>
                        </Button>
                    )}
                    <PrintButton />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                <div className="space-y-6 lg:col-span-3">
                    {/* Agreement Status */}
                    <Card className="rounded-xl bg-muted/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Agreement Status</h3>
                                <p className="text-sm text-muted-foreground">
                                    {agreement.status === "PENDING" && "Waiting for borrower's approval"}
                                    {agreement.status === "ACCEPTED" && "Agreement accepted"}
                                    {agreement.status === "REJECTED" && "Agreement rejected"}
                                    {agreement.status === "DRAFT" && "Agreement draft"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {agreement.status === "PENDING" && loan.borrowerId === userId && (
                                    <AgreementActions agreementId={agreement.id} />
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Interest & Payment Terms */}
                    <Card className="rounded-xl bg-muted/50 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Percent className="h-5 w-5" />
                            Interest & Payment Terms
                        </div>
                        <div className="mt-4 grid gap-4">
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <span className="text-muted-foreground">Interest Rate</span>
                                <span>{agreement.interestRate}%</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <span className="text-muted-foreground">Payment Schedule</span>
                                <span className="capitalize">{agreement.paymentSchedule.toLowerCase()}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <span className="text-muted-foreground">Late Payment Fee</span>
                                <span>{agreement.latePaymentFee}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Grace Period</span>
                                <span>{agreement.gracePeriod} days</span>
                            </div>
                        </div>
                    </Card>

                    {/* Early Repayment & Default Terms */}
                    <Card className="rounded-xl bg-muted/50 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Ban className="h-5 w-5" />
                            Early Repayment & Default Terms
                        </div>
                        <div className="mt-4 grid gap-4">
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <span className="text-muted-foreground">Allow Early Repayment</span>
                                <span>{agreement.allowEarlyRepayment ? "Yes" : "No"}</span>
                            </div>
                            {agreement.allowEarlyRepayment && (
                                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                    <span className="text-muted-foreground">Early Repayment Fee</span>
                                    <span>{agreement.earlyRepaymentFee}%</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <span className="text-muted-foreground">Default Interest Rate</span>
                                <span>{agreement.defaultInterestRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Default Notice Period</span>
                                <span>{agreement.defaultNoticePeriod} days</span>
                            </div>
                        </div>
                    </Card>

                    {/* Collateral */}
                    {agreement.hasCollateral && (
                        <Card className="rounded-xl bg-muted/50 p-6">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <Shield className="h-5 w-5" />
                                Collateral
                            </div>
                            <div className="mt-4 grid gap-4">
                                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                    <span className="text-muted-foreground">Collateral Value</span>
                                    <Currency amount={agreement.collateralValue ?? 0} currency={loan.currency} />
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Description</span>
                                    <p className="mt-2 whitespace-pre-wrap">{agreement.collateralDescription}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Terms & Conditions */}
                    <Card className="rounded-xl bg-muted/50 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <CalendarDays className="h-5 w-5" />
                            Terms & Conditions
                        </div>
                        <div className="mt-4">
                            <div className="whitespace-pre-wrap rounded-lg bg-card p-4">
                                {agreement.terms}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    {/* Loan Details */}
                    <Card className="rounded-xl bg-muted/50 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Loan Details</h2>
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
                    </Card>

                    {/* Agreement History */}
                    {agreementHistory.length > 1 && (
                        <Card className="mt-6 rounded-xl bg-muted/50 p-6">
                            <h2 className="mb-4 text-lg font-semibold">Agreement History</h2>
                            <div className="space-y-4">
                                {agreementHistory.slice(1).map((historicalAgreement) => (
                                    <div
                                        key={historicalAgreement.id}
                                        className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4"
                                    >
                                        <div>
                                            <p className="font-medium">Version {historicalAgreement.version}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Created on {formatDate(historicalAgreement.createdAt)}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/loans/${loanId}/agreement/history`}>
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
