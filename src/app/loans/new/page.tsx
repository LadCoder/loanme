"use client";

import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";

export default function NewLoanPage() {
    const [amount, setAmount] = useState("");
    const [borrowerId, setBorrowerId] = useState("");

    const createLoan = api.loan.create.useMutation({
        onSuccess: () => {
            // Handle success (e.g., redirect to loan list)
            console.log("Loan created successfully!");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createLoan.mutate({
            amount: parseFloat(amount),
            borrowerId,
            currency: "AUD"
        });
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