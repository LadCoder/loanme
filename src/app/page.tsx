import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DollarSign, ArrowRight, Clock, Users, PiggyBank, ArrowUpRight, Wallet, ArrowDownRight } from "lucide-react";
import { db } from "~/server/db";
import { loans, repayments } from "~/server/db/schema";
import { eq, or, and, desc, inArray } from "drizzle-orm";
import { PageContainer } from "~/app/_components/ui/layout/page-container";
import { PageHeader } from "~/app/_components/ui/layout/page-header";
import { Card } from "~/app/_components/ui/card";
import { Button } from "~/app/_components/ui/button";
import { CurrencyDisplay } from "~/app/_components/ui/currency";
import { Badge } from "~/app/_components/ui/badge";
import { cn } from "~/lib/utils";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Get all loans where user is either lender or borrower
  const userLoans = await db.query.loans.findMany({
    where: or(eq(loans.lenderId, userId), eq(loans.borrowerId, userId)),
    orderBy: [desc(loans.createdAt)],
    limit: 5,
  });

  // Get all repayments
  const loanIds = userLoans.map((loan) => loan.id);
  const allRepayments = await db.query.repayments.findMany({
    where: inArray(repayments.loanId, loanIds),
    orderBy: [desc(repayments.dueDate)],
  });

  // Calculate summary statistics
  const totalLent = userLoans
    .filter(loan => loan.lenderId === userId)
    .reduce((sum, loan) => sum + loan.amount, 0);

  const totalBorrowed = userLoans
    .filter(loan => loan.borrowerId === userId)
    .reduce((sum, loan) => sum + loan.amount, 0);

  const pendingRepayments = allRepayments.filter(r => r.status === "PENDING");
  const nextDueDate = pendingRepayments.length > 0
    ? new Date(Math.min(...pendingRepayments.map(r => new Date(r.dueDate).getTime())))
    : null;

  const overdueRepayments = allRepayments.filter(r =>
    r.status === "PENDING" && new Date(r.dueDate) < new Date()
  );

  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        icon={Wallet}
        description="Your loan management dashboard"
      />

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-muted/50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
                  <p className="text-sm text-muted-foreground">Common tasks you might want to do</p>
                </div>
              </div>
              <div className="mt-6 grid gap-2">
                <Button asChild variant="outline" className="justify-start h-14 px-4" size="lg">
                  <Link href="/loans/new">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-3 text-left">
                        <div className="font-semibold">Create New Loan</div>
                        <div className="text-xs text-muted-foreground">Lend money to someone</div>
                      </div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start h-14 px-4" size="lg">
                  <Link href="/repayments/new">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <ArrowUpRight className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-3 text-left">
                        <div className="font-semibold">Make a Repayment</div>
                        <div className="text-xs text-muted-foreground">Pay back borrowed money</div>
                      </div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start h-14 px-4" size="lg">
                  <Link href="/loans">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-3 text-left">
                        <div className="font-semibold">View All Loans</div>
                        <div className="text-xs text-muted-foreground">See your complete loan history</div>
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-muted/50">
              <div className="p-6">
                <h3 className="font-semibold mb-4">Money Flow</h3>
                <div className="grid gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="rounded-full bg-emerald-500/10 p-2">
                        <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-medium">Money Lent</div>
                        <div className="text-sm text-muted-foreground">Money you've given to others</div>
                      </div>
                    </div>
                    <CurrencyDisplay amount={totalLent} className="text-2xl font-semibold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="rounded-full bg-red-500/10 p-2">
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <div className="font-medium">Money Borrowed</div>
                        <div className="text-sm text-muted-foreground">Money you've received from others</div>
                      </div>
                    </div>
                    <CurrencyDisplay amount={totalBorrowed} className="text-2xl font-semibold" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-muted/50">
              <div className="p-6">
                <h3 className="font-semibold mb-2">Payment Status</h3>
                <div className="space-y-4">
                  {overdueRepayments.length > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">
                          {overdueRepayments.length} overdue
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          payment{overdueRepayments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/repayments/new">
                          Make payment
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="default">All up to date</Badge>
                      <span className="text-sm text-muted-foreground">
                        No overdue payments
                      </span>
                    </div>
                  )}
                  {nextDueDate && (
                    <div className="text-sm text-muted-foreground">
                      Next payment due: {nextDueDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="bg-muted/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Recent Loans</h2>
                <p className="text-sm text-muted-foreground">Your latest loan activity</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/loans">View all loans</Link>
              </Button>
            </div>
            <div className="grid gap-3">
              {userLoans.length > 0 ? (
                userLoans.map((loan) => {
                  const isLender = loan.lenderId === userId;
                  return (
                    <div
                      key={loan.id}
                      className="group relative flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors",
                        isLender
                          ? "bg-emerald-500/50 group-hover:bg-emerald-500"
                          : "bg-red-500/50 group-hover:bg-red-500"
                      )} />
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                        isLender
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      )}>
                        {isLender ? (
                          <ArrowUpRight className="h-6 w-6" />
                        ) : (
                          <ArrowDownRight className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="font-medium">
                            {isLender ? "Lent to someone" : "Borrowed from someone"}
                          </div>
                          <Badge
                            className={cn(
                              "capitalize",
                              {
                                "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20": loan.status === "COMPLETED",
                                "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20": loan.status === "PENDING",
                                "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20": loan.status === "ACTIVE",
                                "bg-red-500/10 text-red-500 hover:bg-red-500/20": loan.status === "DEFAULTED",
                                "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20": loan.status === "CANCELLED",
                              }
                            )}
                          >
                            {loan.status.toLowerCase()}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <CurrencyDisplay
                            amount={loan.amount}
                            className="text-lg font-semibold"
                          />
                          <div className="text-sm text-muted-foreground">
                            {loan.duration} months
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Created {new Date(loan.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Link href={`/loans/${loan.id}`}>
                          View details
                        </Link>
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-background/50 rounded-lg">
                  <DollarSign className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">No loans yet</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/loans/new">Create your first loan</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
