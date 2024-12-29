import React from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq, desc, asc, count } from "drizzle-orm";
import { CurrencyDisplay } from "~/app/_components/ui/currency";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/app/_components/ui/table";
import { getStatusDisplay } from "~/utils/loan";
import { formatDate } from "~/utils/date";
import { User } from "lucide-react";
import Link from "next/link";
import { LoanTableHeader } from "~/app/_components/loans/loan-table-header";

// Mark page as dynamic to handle searchParams
export const dynamic = 'force-dynamic';

// Number of items per page
const ITEMS_PER_PAGE = 10;

// Valid sort fields
const SORT_FIELDS = ["amount", "status", "startDate", "duration", "preferredSchedule"] as const;
type SortField = typeof SORT_FIELDS[number];

export default async function LentLoansPage({
    searchParams,
}: {
    searchParams: { page?: string; sort?: string; order?: "asc" | "desc" };
}) {
    const { userId } = await auth();
    if (!userId) return null;

    // Get current page and sort params
    searchParams = await searchParams;
    const currentPage = Number(searchParams.page) || 1;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const sortField = (searchParams.sort || "startDate") as SortField;
    const sortOrder = searchParams.order || "desc";

    // Fetch total count for pagination
    const [countResult] = await db.select({ value: count() }).from(loans).where(eq(loans.lenderId, userId));
    const totalLoans = countResult?.value || 0;

    // Fetch paginated loans with sorting
    const lentLoans = await db.query.loans.findMany({
        where: eq(loans.lenderId, userId),
        orderBy: [sortOrder === "desc" ? desc(loans[sortField]) : asc(loans[sortField])],
        offset: offset,
        limit: ITEMS_PER_PAGE,
    });

    // Get borrower information
    const borrowerIds = lentLoans.map(loan => loan.borrowerId);
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList({
        userId: borrowerIds,
    });

    const getUserName = (userId: string) => {
        const user = users.data.find(u => u.id === userId);
        return user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.emailAddresses[0]?.emailAddress ?? "Unknown User";
    };

    const totalPages = Math.ceil(totalLoans / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto space-y-6 px-1 py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Lent Loans</h1>
            </div>

            <div className="overflow-hidden rounded-xl bg-muted/50">
                <Table>
                    <LoanTableHeader userType="lender" />
                    <TableBody>
                        {lentLoans.map((loan) => (
                            <TableRow key={loan.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <Link
                                        href={`/loans/${loan.id}`}
                                        className="block hover:underline"
                                    >
                                        <CurrencyDisplay
                                            amount={loan.amount}
                                            currency={loan.currency}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <User className="h-3 w-3 text-primary" />
                                        </div>
                                        <span>{getUserName(loan.borrowerId)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{getStatusDisplay(loan.status)}</TableCell>
                                <TableCell>
                                    {loan.startDate ? formatDate(loan.startDate) : "Not started"}
                                </TableCell>
                                <TableCell>{loan.duration} months</TableCell>
                                <TableCell className="capitalize">
                                    {loan.preferredSchedule.toLowerCase()}
                                </TableCell>
                            </TableRow>
                        ))}
                        {lentLoans.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center">
                                    No loans found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link
                            key={page}
                            href={`/loans/lent?page=${page}`}
                            className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-md px-3 text-sm font-medium ${currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 hover:bg-muted"
                                }`}
                        >
                            {page}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
} 