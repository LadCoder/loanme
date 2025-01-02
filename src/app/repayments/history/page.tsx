'use client';

import React from "react";
import { DataTable, type Column } from "~/app/_components/ui/data-table";
import { Currency } from "~/app/_components/ui/currency";
import { formatDate } from "~/utils/date";
import { History, Smile, Meh, Frown } from "lucide-react";
import { cn } from "~/lib/utils";

interface Payment {
    id: number;
    amount: number;
    currency: string;
    dueDate: string;
    paidDate: string;
    status: string;
    loanId: number;
    loanTitle: string;
    mood: "HAPPY" | "NEUTRAL" | "SAD" | null;
    note: string | null;
}

export default function RepaymentsHistoryPage() {
    const [payments, setPayments] = React.useState<Payment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/repayments/history');
                const data = await response.json();
                setPayments(data.payments);
            } catch (error) {
                console.error('Failed to fetch payments:', error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const getMoodIcon = (mood: Payment['mood']) => {
        switch (mood) {
            case "HAPPY":
                return <Smile className="h-4 w-4 text-success" />;
            case "NEUTRAL":
                return <Meh className="h-4 w-4 text-warning" />;
            case "SAD":
                return <Frown className="h-4 w-4 text-destructive" />;
            default:
                return null;
        }
    };

    const columns = React.useMemo<Column<Payment>[]>(() => [
        {
            key: "paidDate",
            header: "Paid Date",
            cell: (_: unknown, row: Payment) => formatDate(row.paidDate),
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
                    row.status === "LATE" && "text-destructive",
                    row.status === "ON_TIME" && "text-success"
                )}>
                    {row.status.toLowerCase().replace('_', ' ')}
                </span>
            ),
            sortable: true,
        },
        {
            key: "dueDate",
            header: "Due Date",
            cell: (_: unknown, row: Payment) => formatDate(row.dueDate),
            sortable: true,
        },
        {
            key: "loanTitle",
            header: "Loan",
            cell: (_: unknown, row: Payment) => row.loanTitle,
            sortable: true,
        },
        {
            key: "mood",
            header: "Mood",
            cell: (_: unknown, row: Payment) => getMoodIcon(row.mood),
            align: "center",
        },
        {
            key: "note",
            header: "Note",
            cell: (_: unknown, row: Payment) => row.note || "-",
        },
    ], []);

    return (
        <div className="container mx-auto space-y-6 px-1 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
            </div>

            <DataTable
                data={payments}
                columns={columns}
                loading={isLoading}
                emptyState={{
                    icon: History,
                    title: "No payment history",
                    description: "You haven't made any payments yet."
                }}
                className="rounded-xl bg-muted/50"
            />
        </div>
    );
} 