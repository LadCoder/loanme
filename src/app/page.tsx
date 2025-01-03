import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DollarSign, ArrowRight, Clock, Users, PiggyBank, ArrowUpRight, Wallet, ArrowDownRight, ChevronRight, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

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
import { CardHeader, CardTitle, CardDescription, CardContent } from "~/app/_components/ui/card";
import { Currency } from "~/app/_components/ui/currency";
import { OverviewChart } from "~/app/_components/ui/charts";

async function getUserName(userId: string) {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const user = await response.json();
    return [user.first_name, user.last_name].filter(Boolean).join(" ") || "Unknown User";
  } catch (error) {
    console.error('Error fetching user:', error);
    return "Unknown User";
  }
}

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Get all loans where user is either lender or borrower
  const userLoans = await db.query.loans.findMany({
    where: or(eq(loans.lenderId, userId), eq(loans.borrowerId, userId)),
    orderBy: [desc(loans.createdAt)],
    limit: 5,
  });

  // Get user names from Clerk
  const userIds = new Set(userLoans.flatMap(loan => [loan.lenderId, loan.borrowerId]));
  const userNames = new Map();

  await Promise.all(
    Array.from(userIds).map(async (id) => {
      const name = await getUserName(id);
      userNames.set(id, name);
    })
  );

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
                <h3 className="text-xl font-semibold tracking-tight mb-4">Money Flow</h3>
                <div className="grid gap-6">
                  <div className="group relative overflow-hidden rounded-lg bg-background/50 p-6 transition-colors hover:bg-background/80">
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors" />
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-emerald-500/10 p-3 transition-colors group-hover:bg-emerald-500/20">
                        <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-lg">Money Lent</div>
                        <CurrencyDisplay amount={totalLent} className="text-3xl font-bold text-emerald-500" />
                        <div className="text-sm text-muted-foreground mt-1">Money you've given to others</div>
                      </div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-lg bg-background/50 p-6 transition-colors hover:bg-background/80">
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-red-500/50 group-hover:bg-red-500 transition-colors" />
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-red-500/10 p-3 transition-colors group-hover:bg-red-500/20">
                        <ArrowDownRight className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-lg">Money Borrowed</div>
                        <CurrencyDisplay amount={totalBorrowed} className="text-3xl font-bold text-red-500" />
                        <div className="text-sm text-muted-foreground mt-1">Money you've received from others</div>
                      </div>
                    </div>
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

        <Card className="mt-4 bg-muted/50">
          <CardHeader>
            <CardTitle>Recent Loans</CardTitle>
            <CardDescription>Your most recent loan activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userLoans.slice(0, 5).map((loan) => {
                const isLender = loan.lenderId === userId;
                return (
                  <Link
                    key={loan.id}
                    href={`/loans/${loan.id}`}
                    className="block group"
                  >
                    <div className="relative flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-all hover:shadow-md">
                      {/* Colored status bar */}
                      <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-all group-hover:w-1.5",
                        {
                          "bg-emerald-500": loan.status === "COMPLETED",
                          "bg-amber-500": loan.status === "PENDING",
                          "bg-blue-500": loan.status === "ACTIVE",
                          "bg-red-500": loan.status === "DEFAULTED",
                          "bg-gray-500": loan.status === "CANCELLED",
                        }
                      )} />

                      {/* Main content with increased padding for status bar */}
                      <div className="flex items-center gap-4 pl-3">
                        {/* Direction indicator */}
                        <div className={cn(
                          "p-3 rounded-full transition-colors",
                          isLender
                            ? "bg-emerald-500/10 text-emerald-700 group-hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-700 group-hover:bg-red-500/20"
                        )}>
                          {isLender ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5" />
                          )}
                        </div>

                        {/* Loan details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">
                              {isLender ? "Lent to" : "Borrowed from"}{" "}
                              <span className="text-muted-foreground">
                                {(isLender ? userNames.get(loan.borrowerId) : userNames.get(loan.lenderId)) ?? "Unknown User"}
                              </span>
                            </p>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "capitalize transition-colors",
                                {
                                  "bg-emerald-500/10 text-emerald-700 group-hover:bg-emerald-500/20": loan.status === "COMPLETED",
                                  "bg-amber-500/10 text-amber-700 group-hover:bg-amber-500/20": loan.status === "PENDING",
                                  "bg-blue-500/10 text-blue-700 group-hover:bg-blue-500/20": loan.status === "ACTIVE",
                                  "bg-red-500/10 text-red-700 group-hover:bg-red-500/20": loan.status === "DEFAULTED",
                                  "bg-gray-500/10 text-gray-700 group-hover:bg-gray-500/20": loan.status === "CANCELLED",
                                }
                              )}
                            >
                              {loan.status.toLowerCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{new Date(loan.createdAt).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                            <span>•</span>
                            <span>{loan.duration} months</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount and action */}
                      <div className="flex items-center gap-3">
                        <CurrencyDisplay amount={loan.amount} className="font-semibold text-lg" />
                        <div className={cn(
                          "p-2 rounded-full transition-colors",
                          "bg-primary/10 text-primary group-hover:bg-primary/20"
                        )}>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
