import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Skeleton } from "../skeleton";

interface DataTableSkeletonProps {
    columnCount: number;
    rowCount?: number;
    hasHeader?: boolean;
}

export function DataTableSkeleton({
    columnCount,
    rowCount = 5,
    hasHeader = true,
}: DataTableSkeletonProps) {
    return (
        <Table>
            {hasHeader && (
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: columnCount }).map((_, i) => (
                            <TableHead key={i}>
                                <Skeleton className="h-6 w-[80px]" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
            )}
            <TableBody>
                {Array.from({ length: rowCount }).map((_, i) => (
                    <TableRow key={i}>
                        {Array.from({ length: columnCount }).map((_, j) => (
                            <TableCell key={j}>
                                <Skeleton className="h-6 w-[80px]" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
