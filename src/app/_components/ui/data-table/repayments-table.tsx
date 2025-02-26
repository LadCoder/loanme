"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { DataTable } from "~/app/_components/ui/data-table";
import {
    createDateColumn,
    createCurrencyColumn,
    createStatusColumn,
} from "~/app/_components/ui/data-table/columns";
import { formatDate } from "~/utils/date";

interface Repayment {
    id: number;
    loanId: number;
    amount: number;
    dueDate: string;
    paidDate: string | null;
    status: string;
    note: string | null;
}

interface RepaymentsTableProps {
    repayments: Repayment[];
}

export function RepaymentsTable({ repayments }: RepaymentsTableProps) {
    const columns = React.useMemo(
        () => [
            createDateColumn("dueDate", "Due Date"),
            createDateColumn("paidDate", "Paid Date", {
                cell: (value: string | null) => (value ? formatDate(value) : "Not paid"),
            }),
            createCurrencyColumn("amount", "Amount"),
            createStatusColumn("status", "Status", {
                getVariant: (status: string) => {
                    switch (status.toLowerCase()) {
                        case "paid":
                            return "default";
                        case "pending":
                            return "secondary";
                        case "late":
                            return "destructive";
                        case "missed":
                            return "outline";
                        default:
                            return "default";
                    }
                },
                transform: (status: string) => {
                    const labels: Record<string, string> = {
                        paid: "Paid",
                        pending: "Pending",
                        late: "Late",
                        missed: "Missed",
                    };
                    return labels[status.toLowerCase()] ?? status;
                },
            }),
        ],
        []
    );

    return (
        <div className="rounded-md bg-muted/50">
            <DataTable
                data={repayments}
                columns={columns}
                emptyState={{
                    icon: Calendar,
                    title: "No repayments found",
                    description: "You don't have any repayments to display.",
                }}
            />
        </div>
    );
} 