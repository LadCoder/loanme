import React from "react";
import { auth } from "@clerk/nextjs/server";
import { LoanTable } from "~/app/_components/loans/loan-table";

export const dynamic = 'force-dynamic';

export default async function LentLoansPage() {
    const { userId } = await auth();
    if (!userId) return null;

    return (
        <div className="container mx-auto space-y-6 px-1 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Lent Loans</h1>
            </div>

            <LoanTable userType="lender" />
        </div>
    );
} 