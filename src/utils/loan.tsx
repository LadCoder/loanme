import React from "react";
import { CheckCircle2, Clock, Ban, AlertCircle, CircleDollarSign } from "lucide-react";
import { cn } from "~/lib/utils";

export type LoanStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "DEFAULTED" | "CANCELLED";

interface StatusConfig {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
}

const statusConfig: Record<LoanStatus, StatusConfig> = {
    PENDING: {
        label: "Pending",
        color: "text-yellow-500",
        icon: Clock,
    },
    ACTIVE: {
        label: "Active",
        color: "text-emerald-500",
        icon: CircleDollarSign,
    },
    COMPLETED: {
        label: "Completed",
        color: "text-sky-500",
        icon: CheckCircle2,
    },
    DEFAULTED: {
        label: "Defaulted",
        color: "text-red-500",
        icon: AlertCircle,
    },
    CANCELLED: {
        label: "Cancelled",
        color: "text-gray-500",
        icon: Ban,
    },
};

export function getStatusDisplay(status: LoanStatus) {
    const config = statusConfig[status];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className={cn("flex items-center gap-1.5", config.color)}>
            <Icon className="h-4 w-4" />
            <span>{config.label}</span>
        </div>
    );
}

export function getStatusColor(status: LoanStatus) {
    return statusConfig[status]?.color;
} 