"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Input } from "~/app/_components/ui/input"

interface InputWithIconProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: LucideIcon
}

export function InputWithIcon({
    icon: Icon,
    className,
    ...props
}: InputWithIconProps) {
    return (
        <div className="relative">
            <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className={cn("pl-9", className)} {...props} />
        </div>
    )
} 