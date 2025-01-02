"use client";

import * as React from "react";
import { Badge } from "~/app/_components/ui/badge";
import { Currency } from "~/app/_components/ui/currency";
import { formatDate } from "~/utils/date";

export interface Column<T> {
    accessorKey: keyof T;
    header: string;
    cell: (value: any, row: T) => React.ReactNode;
    className?: string;
}

interface ColumnOptions<T> {
    cell?: (value: T) => React.ReactNode;
    className?: string;
}

interface StatusColumnOptions {
    getVariant?: (status: string) => "default" | "secondary" | "destructive" | "outline";
    transform?: (status: string) => string;
}

export function createDateColumn<T>(
    accessorKey: keyof T,
    header: string,
    options: ColumnOptions<string | null> = {}
): Column<T> {
    return {
        accessorKey,
        header,
        cell: (value) => {
            if (options.cell) {
                return options.cell(value);
            }
            return value ? formatDate(value) : null;
        },
        className: options.className,
    };
}

export function createCurrencyColumn<T>(
    accessorKey: keyof T,
    header: string,
    options: ColumnOptions<number> = {}
): Column<T> {
    return {
        accessorKey,
        header,
        cell: (value) => {
            if (options.cell) {
                return options.cell(value);
            }
            return <Currency amount={value} currency="AUD" />;
        },
        className: options.className,
    };
}

export function createStatusColumn<T>(
    accessorKey: keyof T,
    header: string,
    options: StatusColumnOptions = {}
): Column<T> {
    return {
        accessorKey,
        header,
        cell: (value) => {
            const variant = options.getVariant?.(value) ?? "default";
            const label = options.transform?.(value) ?? value;
            return <Badge variant={variant}>{label}</Badge>;
        },
    };
}
