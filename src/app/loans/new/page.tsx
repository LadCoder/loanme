"use client";

import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import { createLoan } from "./actions";
import { Label } from "~/app/_components/ui/label";

export default function NewLoanPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [amount, setAmount] = useState("");
    const [borrowerId, setBorrowerId] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error("Please enter a valid amount");
            }

            if (!borrowerId) {
                throw new Error("Please enter a borrower ID");
            }

            await createLoan(parsedAmount, borrowerId);
            toast({
                title: "Success",
                description: "Loan created successfully!",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create loan",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Loan Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter loan amount"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="borrowerId" className="block text-sm font-medium text-gray-700">
                            Borrower ID
                        </Label>
                        <Input
                            id="borrowerId"
                            type="text"
                            value={borrowerId}
                            onChange={(e) => setBorrowerId(e.target.value)}
                            placeholder="Enter borrower's ID"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Create Loan
                    </Button>
                </form>
            </div>
        </div>
    );
} 