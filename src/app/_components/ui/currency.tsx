import * as React from "react";
import { cn } from "~/lib/utils";

interface CurrencyProps {
    amount: number;
    currency?: string;
    className?: string;
}

export function Currency({ amount, currency = "AUD", className }: CurrencyProps) {
    const formatter = new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency,
    });

    return (
        <span className={className}>
            {formatter.format(amount)}
        </span>
    );
}

/**
 * Displays a large currency value with a label
 */
export function CurrencyDisplay({
    amount,
    label,
    currency,
    className,
}: CurrencyProps & { label?: React.ReactNode }) {
    return (
        <div className={cn("space-y-1", className)}>
            {label && <div className="text-sm text-muted-foreground">{label}</div>}
            <Currency
                amount={amount}
                currency={currency}
                className="text-2xl font-semibold tracking-tight"
            />
        </div>
    );
} 