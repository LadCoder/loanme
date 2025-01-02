'use client';

import React from "react";
import { DataTable, type Column } from "~/app/_components/ui/data-table";
import { Currency } from "~/app/_components/ui/currency";
import { formatDate } from "~/utils/date";
import { Calendar } from "lucide-react";

interface Payment {
    id: number;
    amount: number;
    currency: string;
    dueDate: string;
    paidDate: string | null;
    status: string;
    note: string | null;
}

interface LoanPaymentHistoryProps {
    loanId: number;
}

export function LoanPaymentHistory({ loanId }: LoanPaymentHistoryProps) {
    const [payments, setPayments] = React.useState<Payment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/loans/${loanId}/payments`);
                const data = await response.json();
                setPayments(data.payments);
            } catch (error) {
                console.error('Failed to fetch payments:', error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [loanId]);

    const columns = React.useMemo<Column<Payment>[]>(() => [
        {
            key: "dueDate",
            header: "Due Date",
            cell: (_: unknown, row: Payment) => formatDate(row.dueDate),
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
                <span className="capitalize">{row.status.toLowerCase()}</span>
            ),
            sortable: true,
        },
        {
            key: "paidDate",
            header: "Paid Date",
            cell: (_: unknown, row: Payment) => row.paidDate ? formatDate(row.paidDate) : "Not paid",
            sortable: true,
        },
        {
            key: "note",
            header: "Note",
            cell: (_: unknown, row: Payment) => row.note || "-",
        },
    ], []);

    return (
        <DataTable
            data={payments}
            columns={columns}
            loading={isLoading}
            emptyState={{
                icon: Calendar,
                title: "No payments found",
                description: "No payments have been made yet."
            }}
            className="rounded-xl bg-background/50"
        />
    );
} 