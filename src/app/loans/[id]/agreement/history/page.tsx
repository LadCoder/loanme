import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans, agreements } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card } from "~/app/_components/ui/card";
import { formatDate } from "~/utils/date";
import { Button } from "~/app/_components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function AgreementHistoryPage({ params }: PageProps) {
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

    return (
        <div className="container mx-auto space-y-6 py-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/loans/${loanId}/agreement/view`}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to Agreement</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Agreement History</h1>
                </div>
            </div>

            <div className="space-y-6">
                {agreementHistory.map((agreement, index) => (
                    <Card key={agreement.id} className="rounded-xl bg-muted/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Version {agreement.version}
                                    {index === 0 && " (Current)"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Created on {formatDate(agreement.createdAt)}
                                </p>
                                {agreement.signedAt && (
                                    <p className="text-sm text-muted-foreground">
                                        Signed on {formatDate(agreement.signedAt)}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/loans/${loanId}/agreement/view?version=${agreement.version}`}>
                                        View
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-4">
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <span className="text-muted-foreground">Status</span>
                                <span className="capitalize">{agreement.status.toLowerCase()}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <span className="text-muted-foreground">Interest Rate</span>
                                <span>{agreement.interestRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Payment Schedule</span>
                                <span className="capitalize">{agreement.paymentSchedule.toLowerCase()}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 