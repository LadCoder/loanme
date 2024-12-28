import {
  PiggyBank,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  BadgeCheck,
  AlertCircle,
  Ban,
} from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import { Currency, CurrencyDisplay } from "~/app/_components/ui/currency";
import Link from "next/link";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return <BadgeCheck className="h-4 w-4 text-success" />;
    case 'PENDING':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'DEFAULTED':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'CANCELLED':
      return <Ban className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
}

export default async function HomePage() {
  const session = await auth();
  if (!session?.userId) return null;

  const [lentLoans, borrowedLoans] = await Promise.all([
    db.query.loans.findMany({
      where: eq(loans.lenderId, session.userId),
      orderBy: [desc(loans.createdAt)],
      limit: 5,
    }),
    db.query.loans.findMany({
      where: eq(loans.borrowerId, session.userId),
      orderBy: [desc(loans.createdAt)],
      limit: 5,
    }),
  ]);

  const totalLent = lentLoans.reduce((acc, loan) => acc + loan.amount, 0);
  const totalBorrowed = borrowedLoans.reduce((acc, loan) => acc + loan.amount, 0);

  return (
    <div className="space-y-8">
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
        <div className="rounded-xl bg-muted/50 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-2">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Total Money Lent</h3>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <CurrencyDisplay
            amount={totalLent}
            label={`Across ${lentLoans.length} loans`}
          />
        </div>

        <div className="rounded-xl bg-muted/50 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-2">
                <ArrowLeft className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Total Money Borrowed</h3>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <CurrencyDisplay
            amount={totalBorrowed}
            label={`Across ${borrowedLoans.length} loans`}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ArrowRight className="h-5 w-5" />
            Recent Loans You've Given
          </h3>
          <div className="space-y-2">
            {lentLoans.map((loan) => (
              <Link
                key={loan.id}
                href={`/loans/${loan.id}`}
                className="flex items-center justify-between rounded-lg bg-background/50 p-3 transition-colors hover:bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <Currency amount={loan.amount} className="text-sm font-medium leading-none" />
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getStatusIcon(loan.status)}
                      <span>{loan.status}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ArrowLeft className="h-5 w-5" />
            Recent Loans You've Received
          </h3>
          <div className="space-y-2">
            {borrowedLoans.map((loan) => (
              <Link
                key={loan.id}
                href={`/loans/${loan.id}`}
                className="flex items-center justify-between rounded-lg bg-background/50 p-3 transition-colors hover:bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <Currency amount={loan.amount} className="text-sm font-medium leading-none" />
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getStatusIcon(loan.status)}
                      <span>{loan.status}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
