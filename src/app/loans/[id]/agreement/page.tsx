import { AgreementForm } from "~/app/_components/AgreementForm";
import { Card } from "~/app/_components/ui/card";
import { Suspense } from "react";
import { LoanDetails } from "./LoanDetails";
import { Skeleton } from "~/app/_components/ui/skeleton";
import { AgreementFormWrapper } from "./AgreementFormWrapper";
import { FileText } from "lucide-react";

function LoanDetailsSkeleton() {
    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Amount</span>
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Status</span>
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Duration</span>
                <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Created</span>
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-muted-foreground">Start Date</span>
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">End Date</span>
                <Skeleton className="h-6 w-24" />
            </div>
        </div>
    );
}

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function AgreementPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <div className="container mx-auto space-y-6 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Create Loan Agreement</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                <div className="space-y-6 lg:col-span-3">
                    <AgreementFormWrapper loanId={id} />
                </div>

                <div className="lg:col-span-1">
                    <Card className="rounded-xl bg-muted/50 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <FileText className="h-5 w-5" />
                            Loan Details
                        </div>
                        <div className="mt-4">
                            <Suspense fallback={<LoanDetailsSkeleton />}>
                                <LoanDetails id={id} />
                            </Suspense>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
} 