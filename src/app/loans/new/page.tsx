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
    const [borrowerEmail, setBorrowerEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error("Please enter a valid amount");
            }

            if (!borrowerEmail) {
                throw new Error("Please enter the borrower's email address");
            }

            await createLoan(parsedAmount, borrowerEmail);
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
                        <Label htmlFor="borrowerEmail" className="block text-sm font-medium text-gray-700">
                            Borrower's Email
                        </Label>
                        <Input
                            id="borrowerEmail"
                            type="email"
                            value={borrowerEmail}
                            onChange={(e) => setBorrowerEmail(e.target.value)}
                            placeholder="Enter borrower's email address"
                            required
                        />
                        <p className="mt-1 text-sm text-muted-foreground">
                            Enter the email address of the person who will be borrowing the money. They must have an account on the platform.
                        </p>
                    </div>
                    <Button type="submit" className="w-full">
                        Create Loan
                    </Button>
                </form>
            </div>
        </div>
    );
} 