'use client';

import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import { AgreementForm } from "~/app/_components/AgreementForm";
import { createAgreement } from "./actions";

interface AgreementFormWrapperProps {
    loanId: string;
}

export function AgreementFormWrapper({ loanId }: AgreementFormWrapperProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (data: {
        interestRate: number;
        paymentSchedule: string;
        terms: string;
    }) => {
        try {
            await createAgreement(parseInt(loanId), data);
            toast({
                title: "Success",
                description: "Agreement created successfully!",
            });
            router.push(`/loans/${loanId}`);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create agreement",
                variant: "destructive",
            });
        }
    };

    return <AgreementForm onSubmit={handleSubmit} />;
} 