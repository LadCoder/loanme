import React from "react";
import { BadgeCheck, Clock, AlertCircle, Ban } from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * Returns the appropriate icon component for a loan status
 */
export function getStatusIcon(status: string) {
    switch (status.toUpperCase()) {
        case "ACTIVE":
            return <BadgeCheck className="h-4 w-4 text-success" />;
        case "PENDING":
            return <Clock className="h-4 w-4 text-warning" />;
        case "DEFAULTED":
            return <AlertCircle className="h-4 w-4 text-destructive" />;
        case "CANCELLED":
            return <Ban className="h-4 w-4 text-muted-foreground" />;
        default:
            return null;
    }
}

/**
 * Returns a styled component displaying the loan status with an icon
 */
export function getStatusDisplay(status: string) {
    const colors: Record<string, string> = {
        ACTIVE: "text-success",
        PENDING: "text-warning",
        DEFAULTED: "text-destructive",
        CANCELLED: "text-muted-foreground",
    };

    return (
        <div className={cn("flex items-center gap-1 text-xs font-medium", colors[status.toUpperCase()])}>
            {getStatusIcon(status)}
            <span>{status}</span>
        </div>
    );
}

/**
 * Type for valid loan statuses
 */
export type LoanStatus = "ACTIVE" | "PENDING" | "DEFAULTED" | "CANCELLED";

/**
 * Type for loan repayment schedules
 */
export type RepaymentSchedule = "WEEKLY" | "FORTNIGHTLY" | "MONTHLY"; 