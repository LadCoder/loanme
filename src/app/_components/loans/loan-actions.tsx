'use client';

import { Button } from "~/app/_components/ui/button";
import { startLoan, acceptLoan, rejectLoan, completeLoan } from "~/app/_actions/loans";
import { useToast } from "~/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { LoanStatus } from "~/utils/loan";

interface LoanActionsProps {
    loanId: number;
    status: LoanStatus;
    isLender: boolean;
    isBorrower: boolean;
}

export function LoanActions({ loanId, status, isLender, isBorrower }: LoanActionsProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (action: (id: number) => Promise<void>) => {
        setIsLoading(true);
        try {
            await action(loanId);
            toast({
                title: "Success",
                description: "Loan status updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update loan status.",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    if (status === "PENDING" && isLender) {
        return (
            <Button
                onClick={() => handleAction(startLoan)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting Loan...
                    </>
                ) : (
                    "Start Loan"
                )}
            </Button>
        );
    }

    if (status === "PENDING" && isBorrower) {
        return (
            <div className="flex gap-2">
                <Button
                    onClick={() => handleAction(acceptLoan)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Accepting...
                        </>
                    ) : (
                        "Accept"
                    )}
                </Button>
                <Button
                    onClick={() => handleAction(rejectLoan)}
                    variant="destructive"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Rejecting...
                        </>
                    ) : (
                        "Reject"
                    )}
                </Button>
            </div>
        );
    }

    if (status === "ACTIVE" && isLender) {
        return (
            <Button
                onClick={() => handleAction(completeLoan)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                    </>
                ) : (
                    "Complete Loan"
                )}
            </Button>
        );
    }

    return null;
} 