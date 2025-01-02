"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Card } from "~/app/_components/ui/card"

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    icon?: LucideIcon;
}

export function FormSection({
    title,
    description,
    icon: Icon,
    className,
    children,
    ...props
}: FormSectionProps) {
    return (
        <Card className={cn("rounded-xl bg-muted/50", className)} {...props}>
            <div className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    {Icon && <Icon className="h-5 w-5" />}
                    {title}
                </div>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
                <div className="grid gap-4">{children}</div>
            </div>
        </Card>
    );
} 