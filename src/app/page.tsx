import {
  PiggyBank,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  BadgeCheck,
  AlertCircle,
  Ban,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Currency, CurrencyDisplay } from "~/app/_components/ui/currency";
import Link from "next/link";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { formatDate } from "~/utils/date";
import { cn } from "~/lib/utils";

type ClerkUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: { emailAddress: string }[];
};

function getStatusDisplay(status: string) {
  const colors: Record<string, string> = {
    ACTIVE: "text-success",
    PENDING: "text-warning",
    DEFAULTED: "text-destructive",
    CANCELLED: "text-muted-foreground",
  };

  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium", colors[status.toUpperCase()])}>
      {getStatusIcon(status)}
      <span>{status}</span>
    </div>
  );
}

function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return <BadgeCheck className="h-4 w-4" />;
    case 'PENDING':
      return <Clock className="h-4 w-4" />;
    case 'DEFAULTED':
      return <AlertCircle className="h-4 w-4" />;
    case 'CANCELLED':
      return <Ban className="h-4 w-4" />;
    default:
      return null;
  }
}

export default async function HomePage() {
  const session = await auth();
  if (!session?.userId) return null;

  // Fetch all loans
  const [lentLoans, borrowedLoans] = await Promise.all([
    db.query.loans.findMany({
      where: eq(loans.lenderId, session.userId),
      orderBy: [desc(loans.createdAt)],
    }),
    db.query.loans.findMany({
      where: eq(loans.borrowerId, session.userId),
      orderBy: [desc(loans.createdAt)],
    }),
  ]);

  // Calculate statistics
  const totalLent = lentLoans.reduce((acc, loan) => acc + loan.amount, 0);
  const totalBorrowed = borrowedLoans.reduce((acc, loan) => acc + loan.amount, 0);

  const activeLentLoans = lentLoans.filter(loan => loan.status === "ACTIVE");
  const activeBorrowedLoans = borrowedLoans.filter(loan => loan.status === "ACTIVE");
  const pendingLentLoans = lentLoans.filter(loan => loan.status === "PENDING");
  const pendingBorrowedLoans = borrowedLoans.filter(loan => loan.status === "PENDING");

  // Get user information for the first 5 loans
  const recentLentLoans = lentLoans.slice(0, 5);
  const recentBorrowedLoans = borrowedLoans.slice(0, 5);

  const userIds = new Set([
    ...recentLentLoans.map(loan => loan.borrowerId),
    ...recentBorrowedLoans.map(loan => loan.lenderId),
  ]);

  const clerk = await clerkClient();
  const users = await clerk.users.getUserList({
    userId: Array.from(userIds),
  });

  const getUserName = (userId: string) => {
    const user = users.data.find((u: ClerkUser) => u.id === userId);
    return user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.emailAddresses[0]?.emailAddress ?? "Unknown User";
  };

  return (
    <div className="container mx-auto space-y-6 px-3 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <Button asChild>
          <Link href="/loans/new">
            <PiggyBank className="mr-2 h-4 w-4" />
            Create New Loan
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-muted/50 p-6 transition-all hover:bg-muted/70">
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Money Lent</h3>
                <p className="text-sm text-muted-foreground">Funds you've provided to others</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {activeLentLoans.slice(0, 3).map((_, i) => (
                  <div key={i} className="inline-block rounded-full border-2 border-background bg-primary/10 p-2">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CurrencyDisplay
              amount={totalLent}
              className="text-3xl font-bold tracking-tight"
              label={
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-success" />
                    <span>{activeLentLoans.length} Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-warning" />
                    <span>{pendingLentLoans.length} Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{lentLoans.length} Total</span>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-6 transition-all hover:bg-muted/70">
          <div className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <ArrowLeft className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Money Borrowed</h3>
                <p className="text-sm text-muted-foreground">Funds you've received from others</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {activeBorrowedLoans.slice(0, 3).map((_, i) => (
                  <div key={i} className="inline-block rounded-full border-2 border-background bg-primary/10 p-2">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CurrencyDisplay
              amount={totalBorrowed}
              className="text-3xl font-bold tracking-tight"
              label={
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-success" />
                    <span>{activeBorrowedLoans.length} Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-warning" />
                    <span>{pendingBorrowedLoans.length} Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{borrowedLoans.length} Total</span>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ArrowRight className="h-5 w-5" />
            Recent Loans You've Given
          </h3>
          <div className="space-y-3">
            {recentLentLoans.map((loan) => (
              <Link
                key={loan.id}
                href={`/loans/${loan.id}`}
                className="flex items-center rounded-lg bg-background/50 p-3 transition-colors hover:bg-muted"
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Currency amount={loan.amount} className="text-sm font-medium leading-none" />
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="truncate">{getUserName(loan.borrowerId)}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex items-center gap-4">
                  <div className="grid gap-1 text-right">
                    {getStatusDisplay(loan.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(loan.createdAt)}</span>
                    </div>
                  </div>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
            {recentLentLoans.length === 0 && (
              <div className="rounded-lg bg-background/50 p-3 text-center text-sm text-muted-foreground">
                No loans yet
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ArrowLeft className="h-5 w-5" />
            Recent Loans You've Received
          </h3>
          <div className="space-y-3">
            {recentBorrowedLoans.map((loan) => (
              <Link
                key={loan.id}
                href={`/loans/${loan.id}`}
                className="flex items-center rounded-lg bg-background/50 p-3 transition-colors hover:bg-muted"
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Currency amount={loan.amount} className="text-sm font-medium leading-none" />
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="truncate">{getUserName(loan.lenderId)}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex items-center gap-4">
                  <div className="grid gap-1 text-right">
                    {getStatusDisplay(loan.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(loan.createdAt)}</span>
                    </div>
                  </div>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
            {recentBorrowedLoans.length === 0 && (
              <div className="rounded-lg bg-background/50 p-3 text-center text-sm text-muted-foreground">
                No loans yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
