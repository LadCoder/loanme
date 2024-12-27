"use client";

import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";

export default function NewLoanPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [amount, setAmount] = useState("");
    const [borrowerId, setBorrowerId] = useState("");

    const createLoan = api.loan.create.useMutation({
        onSuccess: (data) => {
            if (!data?.id) {
                toast({
                    title: "Error",
                    description: "Failed to get loan ID",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Loan created successfully!",
            });

            // Use replace instead of push to avoid back button issues
            router.replace(`/loans/${data.id}/agreement`);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createLoan.mutateAsync({
                amount: parseFloat(amount),
                borrowerId,
                currency: "AUD"
            });
        } catch (error) {
            console.error("Failed to create loan:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Loan</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Amount
                    </label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                        placeholder="Enter loan amount"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Borrower ID
                    </label>
                    <Input
                        type="text"
                        value={borrowerId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBorrowerId(e.target.value)}
                        placeholder="Enter borrower's ID"
                        required
                    />
                </div>

                <Button type="submit" disabled={createLoan.isLoading}>
                    {createLoan.isLoading ? "Creating..." : "Create Loan"}
                </Button>
            </form>
        </div>
    );
} 