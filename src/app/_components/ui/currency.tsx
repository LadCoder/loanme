import * as React from "react";
import { cn } from "../../../lib/utils";
import {
    type CurrencyDisplayProps,
    formatCurrency,
    formatCompactCurrency,
    formatCurrencyDifference,
    getCurrencyColorClass,
} from "../../../utils/currency";

export function Currency({
    amount,
    compact = false,
    showDifference = false,
    className,
    ...options
}: CurrencyDisplayProps) {
    let formattedValue: string;

    if (showDifference) {
        formattedValue = formatCurrencyDifference(amount, options);
    } else if (compact) {
        formattedValue = formatCompactCurrency(amount, options);
    } else {
        formattedValue = formatCurrency(amount, options);
    }

    return (
        <span
            className={cn(
                "tabular-nums",
                showDifference && getCurrencyColorClass(amount),
                className
            )}
        >
            {formattedValue}
        </span>
    );
}

/**
 * Displays a large currency value with a label
 */
export function CurrencyDisplay({
    amount,
    label,
    className,
    ...props
}: CurrencyDisplayProps & { label: string }) {
    return (
        <div className={cn("space-y-1", className)}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <Currency
                amount={amount}
                className="text-2xl font-semibold tracking-tight"
                {...props}
            />
        </div>
    );
}

/**
 * Displays a currency value with a subtle background
 */
export function CurrencyBadge({
    amount,
    className,
    ...props
}: CurrencyDisplayProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md bg-muted/50 px-2 py-1 text-sm font-medium ring-1 ring-inset ring-muted/60",
                className
            )}
        >
            <Currency amount={amount} {...props} />
        </span>
    );
}

/**
 * Displays a currency difference with a colored background
 */
export function CurrencyDifferenceBadge({
    amount,
    className,
    ...props
}: CurrencyDisplayProps) {
    const isPositive = amount >= 0;
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset",
                isPositive
                    ? "bg-success-500/10 text-success-700 ring-success-500/20 dark:bg-success-500/10 dark:text-success-400 dark:ring-success-500/20"
                    : "bg-destructive/10 text-destructive-700 ring-destructive/20 dark:bg-destructive/10 dark:text-destructive-400 dark:ring-destructive/20",
                className
            )}
        >
            <Currency amount={amount} showDifference {...props} />
        </span>
    );
} 