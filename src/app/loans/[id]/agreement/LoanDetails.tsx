import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { Currency } from "~/app/_components/ui/currency";
import { notFound } from "next/navigation";

interface Props {
    id: string;
}

export async function LoanDetails({ id }: Props) {
    const loan = await db.query.loans.findFirst({
        where: eq(loans.id, parseInt(id)),
    });

    if (!loan) {
        notFound();
    }

    return (
        <div className="space-y-2">
            <div>
                <span className="font-medium">Loan Amount:</span>{" "}
                <Currency amount={loan.amount} />
            </div>
            <div>
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{loan.status.toLowerCase()}</span>
            </div>
            <div>
                <span className="font-medium">Created:</span>{" "}
                {loan.createdAt.toLocaleDateString()}
            </div>
        </div>
    );
} 