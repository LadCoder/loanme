import { AgreementForm } from "~/app/_components/AgreementForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Suspense } from "react";
import { LoanDetails } from "./LoanDetails";
import { Skeleton } from "~/app/_components/ui/skeleton";
import { AgreementFormWrapper } from "./AgreementFormWrapper";

function LoanDetailsSkeleton() {
    return (
        <div className="space-y-2">
            <div>
                <span className="font-medium">Loan Amount:</span>{" "}
                <Skeleton className="inline-block h-6 w-24" />
            </div>
            <div>
                <span className="font-medium">Status:</span>{" "}
                <Skeleton className="inline-block h-6 w-20" />
            </div>
            <div>
                <span className="font-medium">Created:</span>{" "}
                <Skeleton className="inline-block h-6 w-32" />
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
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create Loan Agreement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <Suspense fallback={<LoanDetailsSkeleton />}>
                            <LoanDetails id={id} />
                        </Suspense>
                        <AgreementFormWrapper loanId={id} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 