import { LoanForm } from "~/app/_components/forms/loan-form";

export default function NewLoanPage() {
    return (
        <div className="container mx-auto space-y-6 px-1 py-6">
            <div className="mx-auto">
                <h1 className="mb-8 text-3xl font-bold tracking-tight">Create New Loan</h1>
                <LoanForm />
            </div>
        </div>
    );
} 