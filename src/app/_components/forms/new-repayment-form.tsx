"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "~/app/_components/ui/button";
import { Form } from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/app/_components/ui/select";
import { Textarea } from "~/app/_components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { FormSection } from "~/app/_components/ui/form/form-section";
import { FormFieldWithDescription } from "~/app/_components/ui/form/form-field-with-description";
import { InputWithIcon } from "~/app/_components/ui/form/input-with-icon";
import { Currency } from "~/app/_components/ui/currency";

interface Loan {
    id: number;
    amount: number;
    currency: string;
    status: string;
}

interface NewRepaymentFormProps {
    loans: Loan[];
}

const formSchema = z.object({
    loanId: z.coerce.number().min(1, "Please select a loan"),
    amount: z.coerce
        .number()
        .min(1, "Amount must be greater than 0")
        .max(1000000, "Amount cannot exceed $1,000,000"),
    note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
});

export function NewRepaymentForm({ loans }: NewRepaymentFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            note: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/loans/${values.loanId}/repayments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to make repayment");
            }

            toast({
                title: "Success",
                description: "Repayment made successfully",
            });
            router.push("/repayments");
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormSection
                    icon={DollarSign}
                    title="Repayment Details"
                    description="Enter the repayment details"
                >
                    <FormFieldWithDescription
                        control={form.control}
                        name="loanId"
                        label="Select Loan"
                        description="Choose which loan to make a repayment for"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedLoan(
                                        loans.find((loan) => loan.id === parseInt(value)) ?? null
                                    );
                                }}
                                defaultValue={field.value?.toString()}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a loan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {loans.map((loan) => (
                                        <SelectItem key={loan.id} value={loan.id.toString()}>
                                            <Currency
                                                amount={loan.amount}
                                                currency={loan.currency}
                                            />
                                            {" - "}
                                            <span className="capitalize">
                                                {loan.status.toLowerCase()}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    <FormFieldWithDescription
                        control={form.control}
                        name="amount"
                        label="Amount"
                        description="Enter the repayment amount"
                        render={({ field }) => (
                            <InputWithIcon
                                icon={DollarSign}
                                type="number"
                                step="0.01"
                                {...field}
                            />
                        )}
                    />

                    <FormFieldWithDescription
                        control={form.control}
                        name="note"
                        label="Note"
                        description="Add a note to this repayment (optional)"
                        render={({ field }) => (
                            <Textarea
                                className="resize-none"
                                placeholder="Add a note..."
                                {...field}
                            />
                        )}
                    />
                </FormSection>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Making repayment...
                            </>
                        ) : (
                            "Make Repayment"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 