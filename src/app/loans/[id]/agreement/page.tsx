"use client";

import { Suspense } from "react";
import AgreementPageContent from "./AgreementPageContent";
import { use } from "react";
import { AgreementSkeleton } from "~/app/_components/skeletons/AgreementSkeleton";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AgreementPage({ params }: PageProps) {
    const resolvedParams = use(params);

    return (
        <Suspense fallback={<AgreementSkeleton />}>
            <AgreementPageContent id={resolvedParams.id} />
        </Suspense>
    );
} 