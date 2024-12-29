'use client';

import { Button } from "~/app/_components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => window.print()}
        >
            <Printer className="h-4 w-4" />
            <span className="sr-only">Print Agreement</span>
        </Button>
    );
} 