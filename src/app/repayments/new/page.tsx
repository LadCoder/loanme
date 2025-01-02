import React from "react";
import { DollarSign } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { PageContainer } from "~/app/_components/ui/layout/page-container";
import { PageHeader } from "~/app/_components/ui/layout/page-header";
import { NewRepaymentForm } from "~/app/_components/forms/new-repayment-form";

export default async function NewRepaymentPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Get all loans where user is the borrower
    const userLoans = await db.query.loans.findMany({
        where: eq(loans.borrowerId, userId),
    });

    if (!userLoans.length) {
        redirect("/loans");
    }

    return (
        <PageContainer>
            <PageHeader
                title="Make a Repayment"
                icon={DollarSign}
                description="Make a repayment on your loan"
            />

            <NewRepaymentForm loans={userLoans} />
        </PageContainer>
    );
} 