"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
    Home,
    PiggyBank,
    FileText,
    Calendar,
    Settings,
    LifeBuoy,
    ChevronRight,
    type LucideIcon,
} from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/app/_components/ui/breadcrumb"
import { Separator } from "~/app/_components/ui/separator"
import { SidebarTrigger } from "~/app/_components/ui/sidebar"

const segmentIcons: Record<string, LucideIcon> = {
    loans: PiggyBank,
    borrowed: PiggyBank,
    lent: PiggyBank,
    new: FileText,
    agreement: FileText,
    repayments: Calendar,
    schedule: Calendar,
    history: Calendar,
    settings: Settings,
    help: LifeBuoy,
};

function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const title = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Get the icon for this segment
        const Icon = segmentIcons[segment.toLowerCase()] ?? PiggyBank;

        // Special cases for loan IDs
        if (segment.match(/^\d+$/)) {
            return {
                href,
                title: `Loan #${segment}`,
                isLast,
                Icon: PiggyBank,
            };
        }

        return {
            href,
            title,
            isLast,
            Icon,
        };
    });

    // If we're on the homepage, show just the Overview breadcrumb
    if (segments.length === 0) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span>Overview</span>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Overview</span>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                        <BreadcrumbItem>
                            {crumb.isLast ? (
                                <BreadcrumbPage className="flex items-center gap-2">
                                    <crumb.Icon className="h-4 w-4" />
                                    <span>{crumb.title}</span>
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={crumb.href} className="flex items-center gap-2">
                                    <crumb.Icon className="h-4 w-4" />
                                    <span>{crumb.title}</span>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {!crumb.isLast && (
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs />
            </div>
        </header>
    );
} 