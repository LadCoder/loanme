import React from "react";
import { Calendar, DollarSign, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { loans, repayments } from "~/server/db/schema";
import { eq, or, inArray } from "drizzle-orm";
import { PageContainer } from "~/app/_components/ui/layout/page-container";
import { PageHeader } from "~/app/_components/ui/layout/page-header";
import { RepaymentsTable } from "~/app/_components/ui/data-table/repayments-table";
import { Card } from "~/app/_components/ui/card";
import { CurrencyDisplay } from "~/app/_components/ui/currency";
import { Badge } from "~/app/_components/ui/badge";
import { cn } from "~/lib/utils";

export default async function RepaymentsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Get all loans where user is either lender or borrower
    const userLoans = await db.query.loans.findMany({
        where: or(eq(loans.lenderId, userId), eq(loans.borrowerId, userId)),
    });

    const loanIds = userLoans.map((loan) => loan.id);

    // Get all repayments for these loans
    const allRepayments = await db.query.repayments.findMany({
        where: inArray(repayments.loanId, loanIds),
        orderBy: (repayments, { desc }) => [desc(repayments.dueDate)],
    });

    // Calculate summary statistics
    const totalPaid = allRepayments
        .filter(r => r.status === "PAID")
        .reduce((sum, r) => sum + r.amount, 0);

    const pendingRepayments = allRepayments.filter(r => r.status === "PENDING");
    const totalPending = pendingRepayments.reduce((sum, r) => sum + r.amount, 0);
    const nextDueDate = pendingRepayments.length > 0
        ? new Date(Math.min(...pendingRepayments.map(r => new Date(r.dueDate).getTime())))
        : null;

    const overdueRepayments = allRepayments.filter(r =>
        r.status === "PENDING" && new Date(r.dueDate) < new Date()
    );
    const totalOverdue = overdueRepayments.reduce((sum, r) => sum + r.amount, 0);

    return (
        <PageContainer>
            <PageHeader
                title="Repayments"
                icon={Calendar}
                description="Track and manage your loan repayments"
            />

            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="bg-muted/50">
                    <div className="p-6">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-emerald-500/10 p-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h3 className="font-semibold">Total Paid</h3>
                        </div>
                        <CurrencyDisplay
                            amount={totalPaid}
                            className="mt-3 text-2xl font-semibold"
                        />
                    </div>
                </Card>

                <Card className="bg-muted/50">
                    <div className="p-6">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-amber-500/10 p-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                            </div>
                            <h3 className="font-semibold">Pending Payments</h3>
                        </div>
                        <CurrencyDisplay
                            amount={totalPending}
                            className="mt-3 text-2xl font-semibold"
                        />
                        {nextDueDate && (
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline">Next due</Badge>
                                <span className="text-sm text-muted-foreground">
                                    {nextDueDate.toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="bg-muted/50">
                    <div className="p-6">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full bg-red-500/10 p-2">
                                <DollarSign className="h-5 w-5 text-red-500" />
                            </div>
                            <h3 className="font-semibold text-red-500">Overdue Amount</h3>
                        </div>
                        <CurrencyDisplay
                            amount={totalOverdue}
                            className="mt-3 text-2xl font-semibold"
                        />
                        {overdueRepayments.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant="destructive">
                                    {overdueRepayments.length} overdue
                                </Badge>
                                <span className="text-sm text-destructive">
                                    payment{overdueRepayments.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <Card className="bg-muted/50">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Payment History</h2>
                    <p className="text-sm text-muted-foreground">
                        View and track all your loan repayments
                    </p>
                </div>
                <div className="p-6">
                    <div className="rounded-lg bg-background/50">
                        <RepaymentsTable repayments={allRepayments} />
                    </div>
                </div>
            </Card>
        </PageContainer>
    );
} 