'use client';

import React from "react";
import { DataTable, type Column } from "~/app/_components/ui/data-table";
import { formatDate } from "~/utils/date";
import { Eye } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import Link from "next/link";

interface Agreement {
    id: number;
    version: number;
    status: string;
    createdAt: string;
    signedAt: string | null;
    interestRate: number;
    paymentSchedule: string;
}

interface AgreementHistoryTableProps {
    loanId: number;
}

export function AgreementHistoryTable({ loanId }: AgreementHistoryTableProps) {
    const [agreements, setAgreements] = React.useState<Agreement[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/loans/${loanId}/agreements`);
                const data = await response.json();
                setAgreements(data.agreements);
            } catch (error) {
                console.error('Failed to fetch agreements:', error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [loanId]);

    const columns = React.useMemo<Column<Agreement>[]>(() => [
        {
            key: "version",
            header: "Version",
            cell: (_: unknown, row: Agreement) => (
                <div className="font-medium">
                    Version {row.version}
                    {row === agreements[0] && " (Current)"}
                </div>
            ),
            sortable: true,
        },
        {
            key: "status",
            header: "Status",
            cell: (_: unknown, row: Agreement) => (
                <span className="capitalize">{row.status.toLowerCase()}</span>
            ),
            sortable: true,
        },
        {
            key: "createdAt",
            header: "Created",
            cell: (_: unknown, row: Agreement) => formatDate(row.createdAt),
            sortable: true,
        },
        {
            key: "signedAt",
            header: "Signed",
            cell: (_: unknown, row: Agreement) => row.signedAt ? formatDate(row.signedAt) : "Not signed",
            sortable: true,
        },
        {
            key: "interestRate",
            header: "Interest Rate",
            cell: (_: unknown, row: Agreement) => `${row.interestRate}%`,
            sortable: true,
        },
        {
            key: "paymentSchedule",
            header: "Schedule",
            cell: (_: unknown, row: Agreement) => (
                <span className="capitalize">{row.paymentSchedule.toLowerCase()}</span>
            ),
            sortable: true,
        },
        {
            key: "actions",
            header: "",
            cell: (_: unknown, row: Agreement) => (
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/loans/${loanId}/agreement/view?version=${row.version}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Link>
                </Button>
            ),
        },
    ], [agreements, loanId]);

    return (
        <DataTable
            data={agreements}
            columns={columns}
            loading={isLoading}
            emptyState={{
                icon: Eye,
                title: "No agreements found",
                description: "There are no agreements to display for this loan."
            }}
            className="rounded-xl bg-muted/50"
        />
    );
} 