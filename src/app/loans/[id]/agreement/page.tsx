"use client";

import { Suspense } from "react";
import AgreementPageContent from "./AgreementPageContent";
import { Loader2 } from "lucide-react";
import { use } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AgreementPage({ params }: PageProps) {
    const resolvedParams = use(params);

    return (
        <Suspense
            fallback={
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Loading...</p>
                    </div>
                </div>
            }
        >
            <AgreementPageContent id={resolvedParams.id} />
        </Suspense>
    );
} 