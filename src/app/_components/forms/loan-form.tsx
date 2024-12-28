"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "~/app/_components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/app/_components/ui/select";
import { Textarea } from "~/app/_components/ui/textarea";
import { createLoan } from "~/app/_actions/loans";
import { useToast } from "~/hooks/use-toast";
import { Card } from "~/app/_components/ui/card";
import { DollarSign, Calendar, User as UserIcon } from "lucide-react";

const formSchema = z.object({
    amount: z.coerce
        .number()
        .min(1, "Amount must be greater than 0")
        .max(1000000, "Amount cannot exceed $1,000,000"),
    currency: z.string().default("AUD"),
    purpose: z.enum(["PERSONAL", "BUSINESS", "EDUCATION", "OTHER"]),
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description cannot exceed 500 characters"),
    duration: z.coerce
        .number()
        .min(1, "Duration must be at least 1 month")
        .max(60, "Duration cannot exceed 60 months"),
    preferredSchedule: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    borrowerEmail: z.string().email("Please enter a valid email address"),
});

export function LoanForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            currency: "AUD",
            purpose: "PERSONAL",
            description: "",
            duration: 1,
            preferredSchedule: "MONTHLY",
            borrowerEmail: "",
            startDate: undefined,
            endDate: undefined,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            await createLoan({
                ...values,
                borrowerId: values.borrowerEmail,
            });
            toast({
                title: "Success",
                description: "Loan request created successfully",
            });
            router.push("/loans");
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
                <Card className="rounded-xl bg-muted/50">
                    <div className="space-y-4 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <DollarSign className="h-5 w-5" />
                            Loan Details
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input type="number" step="0.01" className="pl-9" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Enter the amount you want to lend
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="purpose"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purpose</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a purpose" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PERSONAL">Personal</SelectItem>
                                                <SelectItem value="BUSINESS">Business</SelectItem>
                                                <SelectItem value="EDUCATION">Education</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select the purpose of the loan
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea className="resize-none" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide details about the loan
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="rounded-xl bg-muted/50">
                    <div className="space-y-4 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Calendar className="h-5 w-5" />
                            Loan Schedule
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (months)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" max="60" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the loan duration in months
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="preferredSchedule"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repayment Schedule</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a schedule" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                                <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Choose your preferred repayment schedule
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                onChange={e => field.onChange(e.target.valueAsDate)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            When should the loan start?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                onChange={e => field.onChange(e.target.valueAsDate)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            When should the loan end?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-xl bg-muted/50">
                    <div className="space-y-4 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <UserIcon className="h-5 w-5" />
                            Borrower Information
                        </div>
                        <FormField
                            control={form.control}
                            name="borrowerEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Borrower's Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter borrower's email address" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the email address of the person who will be borrowing the money. They must have an account on the platform.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <div className="flex items-center gap-4">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Loan...
                            </>
                        ) : (
                            'Create Loan'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
} 