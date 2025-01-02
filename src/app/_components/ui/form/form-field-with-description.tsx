"use client"

import * as React from "react"
import { Control } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/app/_components/ui/form"

interface FormFieldWithDescriptionProps {
    control: Control<any>
    name: string
    label: string
    description?: string
    render: (props: { field: any }) => React.ReactNode
}

export function FormFieldWithDescription({
    control,
    name,
    label,
    description,
    render,
}: FormFieldWithDescriptionProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>{render({ field })}</FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
} 