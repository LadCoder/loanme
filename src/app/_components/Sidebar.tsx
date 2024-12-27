"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Banknote, Home, PiggyBank, Plus, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";

const sidebarLinks = [
    {
        title: "Home",
        href: "/",
        icon: Home,
    },
    {
        title: "My Loans",
        href: "/loans",
        icon: PiggyBank,
    },
    {
        title: "New Loan",
        href: "/loans/new",
        icon: Plus,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col gap-4 p-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <Banknote className="h-6 w-6" />
                <span className="font-bold">LoanMe</span>
            </Link>

            {/* Navigation */}
            <div className="flex-1 py-8">
                <nav className="grid gap-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                    isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{link.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User section */}
            <div className="mt-auto flex flex-col gap-4">
                <ModeToggle />
                <div className="flex items-center gap-4 rounded-lg border px-3 py-2">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Account</span>
                        <span className="text-xs text-muted-foreground">Manage your profile</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 