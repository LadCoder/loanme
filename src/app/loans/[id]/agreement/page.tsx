'use client';

import { AgreementForm } from "~/app/_components/AgreementForm";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { createAgreement } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import { Suspense } from "react";
import { LoanDetails } from "./LoanDetails";

interface PageProps {
    params: { id: string };
}

export default function AgreementPage({ params }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (data: {
        interestRate: number;
        paymentSchedule: string;
        terms: string;
    }) => {
        try {
            await createAgreement(parseInt(params.id), data);
            toast({
                title: "Success",
                description: "Agreement created successfully!",
            });
            router.push(`/loans/${params.id}`);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create agreement",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create Loan Agreement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <Suspense fallback={<div>Loading loan details...</div>}>
                            <LoanDetails id={params.id} />
                        </Suspense>
                        <AgreementForm onSubmit={handleSubmit} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 