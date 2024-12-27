"use client";

import * as React from "react";
import { api } from "../../../utils/api";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Currency } from "../../_components/ui/currency";

export default function BorrowedLoansPage() {
    const { data: loans, isLoading } = api.loan.getBorrowedLoans.useQuery();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Loading your borrowed loans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Borrowed Loans</h1>
            </div>

            <div className="space-y-4">
                {loans?.map((loan) => (
                    <div key={loan.id} className="rounded-xl bg-muted/50 p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Currency
                                        amount={loan.amount}
                                        code={loan.currency as any}
                                        className="text-2xl font-semibold"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        {loan.status}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Created {new Date(loan.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/loans/${loan.id}`}
                                className="flex items-center gap-2 rounded-lg bg-background/50 px-4 py-2 text-sm transition-colors hover:bg-background"
                            >
                                View Details
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        {loan.agreement && (
                            <div className="mt-4 rounded-lg bg-background/50 p-4">
                                <div className="grid gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Interest Rate</span>
                                        <span className="text-sm">{loan.agreement.interestRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Payment Schedule</span>
                                        <span className="text-sm">{loan.agreement.paymentSchedule}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loans?.length === 0 && (
                    <div className="rounded-xl bg-muted/50 p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            You haven't borrowed any loans yet.
                        </p>
                        <Link
                            href="/loans/new"
                            className="mt-4 inline-block text-sm text-primary hover:underline"
                        >
                            Create your first loan
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
} 