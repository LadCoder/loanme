'use client';

import React from "react";
import { Table, TableBody, TableCell, TableRow } from "~/app/_components/ui/table";
import { LoanTableHeader } from "./loan-table-header";
import { LoanTableSkeleton } from "./loan-table-skeleton";
import { Currency } from "~/app/_components/ui/currency";
import { getStatusDisplay } from "~/utils/loan";
import { formatDate } from "~/utils/date";
import { User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LoanTableProps {
    userType: "lender" | "borrower";
}

interface Loan {
    id: number;
    amount: number;
    currency: string;
    status: string;
    startDate: string | null;
    duration: number;
    preferredSchedule: string;
    lenderId: string;
    borrowerId: string;
}

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: { emailAddress: string }[];
}

export function LoanTable({ userType }: LoanTableProps) {
    const searchParams = useSearchParams();
    const [loans, setLoans] = React.useState<Loan[]>([]);
    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/loans/${userType}?${searchParams.toString()}`);
            const data = await response.json();
            setLoans(data.loans);
            setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        }
        setIsLoading(false);
    }, [searchParams, userType]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.emailAddresses[0]?.emailAddress ?? "Unknown User";
    };

    return (
        <div className="overflow-hidden rounded-xl bg-muted/50">
            <Table>
                <LoanTableHeader userType={userType} />
                {isLoading ? (
                    <LoanTableSkeleton />
                ) : (
                    <TableBody>
                        {loans.map((loan) => (
                            <TableRow key={loan.id} className="hover:bg-muted/50">
                                <TableCell className="w-[120px] whitespace-nowrap">
                                    <Link
                                        href={`/loans/${loan.id}`}
                                        className="block hover:underline"
                                    >
                                        <Currency
                                            amount={loan.amount}
                                            currency={loan.currency}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell className="w-[200px] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <User className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="truncate">
                                            {getUserName(userType === "lender" ? loan.borrowerId : loan.lenderId)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="w-[100px] whitespace-nowrap">{getStatusDisplay(loan.status)}</TableCell>
                                <TableCell className="w-[120px] whitespace-nowrap">
                                    {loan.startDate ? formatDate(loan.startDate) : "Not started"}
                                </TableCell>
                                <TableCell className="w-[100px] whitespace-nowrap">{loan.duration} months</TableCell>
                                <TableCell className="w-[100px] whitespace-nowrap capitalize">
                                    {loan.preferredSchedule?.toLowerCase()}
                                </TableCell>
                            </TableRow>
                        ))}
                        {loans.length === 0 && !isLoading && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center">
                                    No loans found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                )}
            </Table>
        </div>
    );
} 