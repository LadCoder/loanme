"use client";

import React from "react";
import { api } from "~/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AgreementForm } from "~/app/_components/AgreementForm";
import { useToast } from "~/hooks/use-toast";
import { TRPCClientErrorLike } from '@trpc/client';
import { Loader2 } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { useEffect } from "react";

interface Props {
    id: string;
}

export default function AgreementPageContent({ id }: Props) {
    const router = useRouter();
    const { toast } = useToast();

    const { data: loan, isLoading, error, isError } = api.loan.getById.useQuery(
        id,
        {
            retry: false,
            refetchOnWindowFocus: false,
        }
    );

    // Show error toast when error occurs
    useEffect(() => {
        if (isError && error) {
            toast({
                title: "Error",
                description: error.message || "Failed to load loan details",
                variant: "destructive",
            });
        }
    }, [isError, error, toast]);

    const createAgreement = api.agreement.create.useMutation({
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Agreement created successfully!",
            });
            router.push(`/loans/${id}`);
        },
        onError: (error: TRPCClientErrorLike<any>) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create agreement",
                variant: "destructive",
            });
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Loading loan details...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center">
                <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-red-600">Failed to load loan</h3>
                    <p className="mb-4 text-sm text-gray-500">{error?.message || "An error occurred"}</p>
                    <div className="space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/loans')}
                        >
                            Return to Loans
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center">
                <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold">Loan not found</h3>
                    <p className="mb-4 text-sm text-gray-500">The loan you're looking for doesn't exist.</p>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/loans')}
                    >
                        Return to Loans
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Create Loan Agreement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Loan Amount</h3>
                                    <p className="text-2xl font-bold">{loan.amount} {loan.currency}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Status</h3>
                                    <p className="text-2xl font-bold">{loan.status}</p>
                                </div>
                            </div>

                            <AgreementForm
                                onSubmit={(data) => {
                                    createAgreement.mutate({
                                        loanId: parseInt(id),
                                        ...data,
                                    });
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
} 