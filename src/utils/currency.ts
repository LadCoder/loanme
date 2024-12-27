export type CurrencyCode = "USD" | "EUR" | "GBP";

export interface CurrencyFormatOptions {
    code?: CurrencyCode;
    showSymbol?: boolean;
    showCode?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
};

/**
 * Formats a number as currency with proper separators and decimals
 */
export function formatCurrency(
    amount: number,
    {
        code = "USD",
        showSymbol = true,
        showCode = false,
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
    }: CurrencyFormatOptions = {}
): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits,
        maximumFractionDigits,
    });

    const formattedAmount = formatter.format(amount);
    const parts: string[] = [];

    if (showSymbol) {
        parts.push(CURRENCY_SYMBOLS[code]);
    }

    parts.push(formattedAmount);

    if (showCode) {
        parts.push(code);
    }

    return parts.join(" ");
}

/**
 * Formats a number as a compact currency (e.g., $1.2K, $1.2M)
 */
export function formatCompactCurrency(
    amount: number,
    options: CurrencyFormatOptions = {}
): string {
    if (Math.abs(amount) < 1000) {
        return formatCurrency(amount, options);
    }

    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        notation: "compact",
        maximumFractionDigits: 1,
    });

    const formattedAmount = formatter.format(amount);
    const parts: string[] = [];

    if (options.showSymbol ?? true) {
        parts.push(CURRENCY_SYMBOLS[options.code ?? "USD"]);
    }

    parts.push(formattedAmount);

    if (options.showCode) {
        parts.push(options.code ?? "USD");
    }

    return parts.join(" ");
}

/**
 * Formats a number as a difference (e.g., +$100, -$50)
 */
export function formatCurrencyDifference(
    amount: number,
    options: CurrencyFormatOptions = {}
): string {
    const prefix = amount >= 0 ? "+" : "";
    return prefix + formatCurrency(amount, options);
}

/**
 * Returns a color class based on the amount (positive/negative)
 */
export function getCurrencyColorClass(amount: number): string {
    if (amount > 0) {
        return "text-success-500 dark:text-success-400";
    }
    if (amount < 0) {
        return "text-destructive dark:text-destructive-400";
    }
    return "text-muted-foreground";
}

/**
 * Component props for currency display
 */
export interface CurrencyDisplayProps extends CurrencyFormatOptions {
    amount: number;
    compact?: boolean;
    showDifference?: boolean;
    className?: string;
} 