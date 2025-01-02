import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans, agreements } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "~/app/_components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AgreementHistoryTable } from "~/app/_components/loans/agreement-history-table";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function AgreementHistoryPage({ params }: PageProps) {
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

            <AgreementHistoryTable loanId={loanId} />
        </div>
    );
} 