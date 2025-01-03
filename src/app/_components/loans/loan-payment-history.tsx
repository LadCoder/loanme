'use client';

import * as React from "react";
import { Calendar, DollarSign } from "lucide-react";
import { formatDate } from "~/utils/date";
import { DataTable } from "~/app/_components/ui/data-table";
import { Currency } from "~/app/_components/ui/currency";
import {
    createDateColumn,
    createCurrencyColumn,
    createStatusColumn,
} from "~/app/_components/ui/data-table/columns";

interface Payment {
    id: number;
    amount: number;
    dueDate: string;
    paidDate: string | null;
    status: "PENDING" | "PAID" | "LATE" | "MISSED";
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
                const response = await fetch(`/api/loans/${loanId}/repayments`);
                const data = await response.json();
                setPayments(data.repayments);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [loanId]);

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
                    return labels[status.toLowerCase()] || status;
                },
            }),
        ],
        []
    );

    return (
        <DataTable
            data={payments}
            columns={columns}
            loading={isLoading}
            emptyState={{
                icon: Calendar,
                title: "No payments found",
                description: "No payments have been made yet.",
            }}
        />
    );
} 