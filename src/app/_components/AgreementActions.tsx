'use client';

import { Button } from "~/app/_components/ui/button";
import { acceptAgreement, rejectAgreement } from "~/app/loans/[id]/agreement/actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AgreementActionsProps {
    agreementId: number;
}

export function AgreementActions({ agreementId }: AgreementActionsProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAccept = () => {
        startTransition(async () => {
            try {
                await acceptAgreement(agreementId);
                toast.success("Agreement accepted successfully");
                router.refresh();
            } catch (error) {
                toast.error("Failed to accept agreement");
            }
        });
    };

    const handleReject = () => {
        startTransition(async () => {
            try {
                await rejectAgreement(agreementId);
                toast.success("Agreement rejected successfully");
                router.refresh();
            } catch (error) {
                toast.error("Failed to reject agreement");
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={handleAccept}
                disabled={isPending}
            >
                Accept Agreement
            </Button>
            <Button
                onClick={handleReject}
                variant="destructive"
                disabled={isPending}
            >
                Reject Agreement
            </Button>
        </div>
    );
} 