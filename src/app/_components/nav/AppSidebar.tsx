"use client"

import * as React from "react"
import {
    Banknote,
    Home,
    PiggyBank,
    FileText,
    Calendar,
} from "lucide-react"

import { NavMain } from "~/app/_components/nav/NavMain"
import { NavUser } from "~/app/_components/nav/NavUser"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/app/_components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Overview",
            url: "/",
            icon: Home,
            isActive: true,
        },
        {
            title: "Loans",
            url: "/loans",
            icon: PiggyBank,
            items: [
                {
                    title: "My Borrowed Loans",
                    url: "/loans/borrowed",
                },
                {
                    title: "My Lent Loans",
                    url: "/loans/lent",
                },
                {
                    title: "Create New Loan",
                    url: "/loans/new",
                },
            ],
        },
        {
            title: "Agreements",
            url: "/agreements",
            icon: FileText,
            items: [
                {
                    title: "Pending",
                    url: "/agreements/pending",
                },
                {
                    title: "Signed",
                    url: "/agreements/signed",
                },
            ],
        },
        {
            title: "Repayments",
            url: "/repayments",
            icon: Calendar,
            items: [
                {
                    title: "Schedule",
                    url: "/repayments/schedule",
                },
                {
                    title: "History",
                    url: "/repayments/history",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Banknote className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">LoanMe</span>
                                    <span className="truncate text-xs">Personal Loans</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
