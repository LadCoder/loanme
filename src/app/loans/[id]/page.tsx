import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Currency } from "~/app/_components/ui/currency";
import { getStatusDisplay } from "~/utils/loan";
import { formatDate } from "~/utils/date";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
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
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Loan Details</h1>
                <div className="flex items-center gap-2">
                    <Currency amount={loan.amount} currency={loan.currency} />
                    <span className="text-muted-foreground">•</span>
                    {getStatusDisplay(loan.status)}
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
                            <span className="capitalize">{loan.preferredSchedule.toLowerCase()}</span>
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
                        <div className="rounded-lg border bg-background/50 p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                No payments have been made yet
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 