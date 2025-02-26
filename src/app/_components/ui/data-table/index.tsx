"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Button } from "../button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { LoadingState } from "~/app/_components/ui/loading-state";

export interface Column<T> {
    key: keyof T;
    header: string;
    cell?: (value: T[keyof T], row: T) => React.ReactNode;
    sortable?: boolean;
    align?: "left" | "center" | "right";
}

interface EmptyState {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    emptyState?: EmptyState;
    loading?: boolean;
    onSort?: (key: keyof T) => void;
    sortKey?: keyof T;
    sortOrder?: "asc" | "desc";
}

export function DataTable<T>({
    data,
    columns,
    className,
    emptyState,
    loading,
    onSort,
    sortKey,
    sortOrder,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <LoadingState text="Loading data..." />
            </div>
        );
    }

    if (!data.length && emptyState) {
        const Icon = emptyState.icon;
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 p-8 text-center">
                <div className="rounded-full bg-muted p-3">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold">{emptyState.title}</h3>
                {emptyState.description && (
                    <p className="text-sm text-muted-foreground">{emptyState.description}</p>
                )}
            </div>
        );
    }

    return (
        <div className={cn("w-full", className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={String(column.key)}
                                className={cn(
                                    column.align === "right" && "text-right",
                                    column.align === "center" && "text-center"
                                )}
                            >
                                {column.sortable ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="-ml-3 h-8"
                                        onClick={() => onSort?.(column.key)}
                                    >
                                        <span>{column.header}</span>
                                        {sortKey !== column.key && <ArrowUpDown className="ml-2 h-4 w-4" />}
                                        {sortKey === column.key && sortOrder === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                                        {sortKey === column.key && sortOrder === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                                    </Button>
                                ) : (
                                    column.header
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((column) => {
                                const value = row[column.accessorKey];
                                return (
                                    <TableCell
                                        key={String(column.key)}
                                        className={cn(
                                            column.align === "right" && "text-right",
                                            column.align === "center" && "text-center"
                                        )}
                                    >
                                        {column.cell ? column.cell(value, row) : value as React.ReactNode}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
