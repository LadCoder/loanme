import { db } from "~/server/db";
import { loans } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { Currency } from "~/app/_components/ui/currency";
import { notFound } from "next/navigation";
import { formatDate } from "~/utils/date";
import { getStatusDisplay } from "~/utils/loan";

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
                {getStatusDisplay(loan.status)}
            </div>
            <div>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(loan.createdAt)}
            </div>
        </div>
    );
} 