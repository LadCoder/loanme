import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "~/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    icon?: LucideIcon
}

export function PageHeader({
    title,
    description,
    icon: Icon,
    className,
    children,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("mb-8 space-y-4", className)} {...props}>
            <div className="flex items-center gap-3">
                {Icon && <Icon className="h-7 w-7 text-muted-foreground" />}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>
            </div>
            {children}
        </div>
    )
} 