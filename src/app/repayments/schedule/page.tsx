'use client';

import React from "react";
import { DataTable, type Column } from "~/app/_components/ui/data-table";
import { Currency } from "~/app/_components/ui/currency";
import { formatDate } from "~/utils/date";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";

interface Payment {
    id: number;
    amount: number;
    currency: string;
    dueDate: string;
    loanId: number;
    status: string;
    loanTitle: string;
}

export default function RepaymentsSchedulePage() {
    const [payments, setPayments] = React.useState<Payment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/repayments/schedule');
                const data = await response.json();
                setPayments(data.payments);
            } catch (error) {
                console.error('Failed to fetch payments:', error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const columns = React.useMemo<Column<Payment>[]>(() => [
        {
            key: "dueDate",
            header: "Due Date",
            cell: (_: unknown, row: Payment) => (
                <div className="flex items-center gap-2">
                    <Calendar className={cn(
                        "h-4 w-4",
                        new Date(row.dueDate) < new Date() ? "text-destructive" : "text-muted-foreground"
                    )} />
                    <span>{formatDate(row.dueDate)}</span>
                </div>
            ),
            sortable: true,
        },
        {
            key: "amount",
            header: "Amount",
            cell: (_: unknown, row: Payment) => (
                <Currency amount={row.amount} currency={row.currency} />
            ),
            sortable: true,
        },
        {
            key: "status",
            header: "Status",
            cell: (_: unknown, row: Payment) => (
                <span className={cn(
                    "capitalize",
                    row.status === "OVERDUE" && "text-destructive",
                    row.status === "PENDING" && "text-warning"
                )}>
                    {row.status.toLowerCase()}
                </span>
            ),
            sortable: true,
        },
        {
            key: "loanTitle",
            header: "Loan",
            cell: (_: unknown, row: Payment) => row.loanTitle,
            sortable: true,
        },
    ], []);

    return (
        <div className="container mx-auto space-y-6 px-1 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Payment Schedule</h1>
            </div>

            <DataTable
                data={payments}
                columns={columns}
                loading={isLoading}
                emptyState={{
                    icon: AlertCircle,
                    title: "No upcoming payments",
                    description: "You have no scheduled payments at the moment."
                }}
                className="rounded-xl bg-muted/50"
            />
        </div>
    );
} 