"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Percent, CalendarDays, FileText, AlertCircle, Undo2, Ban, Shield } from "lucide-react";

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
import { useToast } from "~/hooks/use-toast";
import { Card } from "~/app/_components/ui/card";
import { Switch } from "~/app/_components/ui/switch";

const formSchema = z.object({
    interestRate: z.coerce
        .number()
        .min(0, "Interest rate cannot be negative")
        .max(100, "Interest rate cannot exceed 100%"),
    paymentSchedule: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),

    // Late Payment Terms
    latePaymentFee: z.coerce
        .number()
        .min(0, "Late payment fee cannot be negative")
        .max(100, "Late payment fee cannot exceed 100%"),
    gracePeriod: z.coerce
        .number()
        .min(0, "Grace period cannot be negative")
        .max(30, "Grace period cannot exceed 30 days"),

    // Early Repayment Terms
    allowEarlyRepayment: z.boolean(),
    earlyRepaymentFee: z.coerce
        .number()
        .min(0, "Early repayment fee cannot be negative")
        .max(100, "Early repayment fee cannot exceed 100%"),

    // Default Terms
    defaultInterestRate: z.coerce
        .number()
        .min(0, "Default interest rate cannot be negative")
        .max(100, "Default interest rate cannot exceed 100%"),
    defaultNoticePeriod: z.coerce
        .number()
        .min(1, "Default notice period must be at least 1 day")
        .max(90, "Default notice period cannot exceed 90 days"),

    // Collateral Information
    hasCollateral: z.boolean(),
    collateralDescription: z.string().max(1000).optional(),
    collateralValue: z.coerce.number().min(0).optional(),

    terms: z.string()
        .min(10, "Terms must be at least 10 characters")
        .max(5000, "Terms cannot exceed 5000 characters"),
});

interface AgreementFormProps {
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
}

export function AgreementForm({ onSubmit }: AgreementFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            interestRate: 0,
            paymentSchedule: "MONTHLY",
            latePaymentFee: 0,
            gracePeriod: 3,
            allowEarlyRepayment: true,
            earlyRepaymentFee: 0,
            defaultInterestRate: 0,
            defaultNoticePeriod: 14,
            hasCollateral: false,
            terms: "",
        },
    });

    const watchHasCollateral = form.watch("hasCollateral");
    const watchAllowEarlyRepayment = form.watch("allowEarlyRepayment");

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            await onSubmit(values);
            toast({
                title: "Success",
                description: "Agreement created successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Interest */}
                <Card className="rounded-xl bg-muted/50 p-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Percent className="h-5 w-5" />
                        Interest
                    </div>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            control={form.control}
                            name="interestRate"
                            render={({ field }) => (
                                <FormItem className="border-b border-border/50 pb-4">
                                    <FormLabel>Interest Rate (%)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="pl-9"
                                                placeholder="Enter annual interest rate"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        The annual interest rate for this loan
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                {/* Repayment Terms */}
                <Card className="rounded-xl bg-muted/50 p-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <CalendarDays className="h-5 w-5" />
                        Repayment Terms
                    </div>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            control={form.control}
                            name="paymentSchedule"
                            render={({ field }) => (
                                <FormItem className="border-b border-border/50 pb-4">
                                    <FormLabel>Repayment Frequency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment frequency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                                            <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                            <SelectItem value="YEARLY">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-muted-foreground">
                                        How often repayments will be made
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="allowEarlyRepayment"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border-b border-border/50 pb-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Allow Early Repayment</FormLabel>
                                        <FormDescription className="text-muted-foreground">
                                            Whether the borrower can repay the loan early
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {watchAllowEarlyRepayment && (
                            <FormField
                                control={form.control}
                                name="earlyRepaymentFee"
                                render={({ field }) => (
                                    <FormItem className="border-b border-border/50 pb-4">
                                        <FormLabel>Early Repayment Fee (%)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="pl-9"
                                                    placeholder="Enter early repayment fee"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-muted-foreground">
                                            Fee for early loan repayment
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="latePaymentFee"
                            render={({ field }) => (
                                <FormItem className="border-b border-border/50 pb-4">
                                    <FormLabel>Late Payment Fee (%)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="pl-9"
                                                placeholder="Enter late payment fee"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Additional fee for late payments
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gracePeriod"
                            render={({ field }) => (
                                <FormItem className="border-b border-border/50 pb-4">
                                    <FormLabel>Grace Period (days)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter grace period"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Days before late fee applies
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                {/* Default Terms */}
                <Card className="rounded-xl bg-muted/50 p-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Ban className="h-5 w-5" />
                        Default Terms
                    </div>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            control={form.control}
                            name="defaultInterestRate"
                            render={({ field }) => (
                                <FormItem className="border-b border-border/50 pb-4">
                                    <FormLabel>Default Interest Rate (%)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                step="0.01"
                                                className="pl-9"
                                                placeholder="Enter default interest rate"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Interest rate applied when loan defaults
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="defaultNoticePeriod"
                            render={({ field }) => (
                                <FormItem className="border-b border-border/50 pb-4">
                                    <FormLabel>Default Notice Period (days)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter notice period"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Days before loan is considered in default
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                {/* Collateral */}
                <Card className="rounded-xl bg-muted/50 p-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <Shield className="h-5 w-5" />
                        Collateral
                    </div>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            control={form.control}
                            name="hasCollateral"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border-b border-border/50 pb-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Requires Collateral</FormLabel>
                                        <FormDescription className="text-muted-foreground">
                                            Whether this loan requires collateral
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {watchHasCollateral && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="collateralDescription"
                                    render={({ field }) => (
                                        <FormItem className="border-b border-border/50 pb-4">
                                            <FormLabel>Collateral Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the collateral..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-muted-foreground">
                                                Detailed description of the collateral
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="collateralValue"
                                    render={({ field }) => (
                                        <FormItem className="border-b border-border/50 pb-4">
                                            <FormLabel>Collateral Value</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Enter collateral value"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-muted-foreground">
                                                Estimated value of the collateral
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                </Card>

                {/* Agreement Terms */}
                <Card className="rounded-xl bg-muted/50 p-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <FileText className="h-5 w-5" />
                        Agreement Terms
                    </div>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Terms & Conditions</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the terms and conditions for this loan agreement..."
                                            className="min-h-[200px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-muted-foreground">
                                        Specify all terms, conditions, and obligations for both parties
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
                                Creating Agreement...
                            </>
                        ) : (
                            'Create Agreement'
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