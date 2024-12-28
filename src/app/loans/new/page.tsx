import { LoanForm } from "~/app/_components/forms/loan-form";

export default function NewLoanPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-3xl font-bold tracking-tight">Create New Loan</h1>
                <LoanForm />
            </div>
        </div>
    );
} 