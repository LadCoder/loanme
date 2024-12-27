"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { Banknote } from "lucide-react";

const MotionLink = motion(Link);

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function MainNav() {
    const pathname = usePathname();

    const routes = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/loans",
            label: "My Loans",
            active: pathname === "/loans" || pathname.startsWith("/loans/"),
        },
        {
            href: "/loans/new",
            label: "New Loan",
            active: pathname === "/loans/new",
        },
    ];

    return (
        <div className="mr-4 flex items-center">
            <MotionLink
                href="/"
                className="group mr-6 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex items-center">
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 5,
                        }}
                        className="relative"
                    >
                        <Banknote className="h-6 w-6 text-brand transition-colors group-hover:text-brand-light" />
                        <div className="absolute -inset-2 -z-10 animate-pulse rounded-full bg-brand/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    </motion.div>
                    <span className="ml-2 hidden bg-gradient-to-r from-brand-gradient-start via-brand-gradient-middle to-brand-gradient-end bg-clip-text text-xl font-bold text-transparent opacity-90 transition-opacity hover:opacity-100 sm:inline-block">
                        LoanMe
                    </span>
                </div>
            </MotionLink>
            <motion.nav
                className="flex items-center space-x-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {routes.map((route) => (
                    <motion.div key={route.href} variants={item}>
                        <Link
                            href={route.href}
                            className={cn(
                                "group relative px-1 py-2 text-sm font-medium transition-colors hover:text-brand",
                                route.active ? "text-brand" : "text-muted-foreground"
                            )}
                        >
                            <span className="relative">
                                {route.label}
                                <span className="absolute -inset-x-2 -inset-y-1 -z-10 scale-90 rounded-lg bg-brand/5 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
                            </span>
                            {route.active ? (
                                <motion.div
                                    className="absolute -bottom-px left-0 h-px w-full bg-gradient-to-r from-brand-gradient-start/60 via-brand-gradient-middle to-brand-gradient-end/60"
                                    layoutId="navbar-active"
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            ) : (
                                <div className="absolute -bottom-px left-0 h-px w-full scale-x-0 bg-gradient-to-r from-brand-gradient-start/60 via-brand-gradient-middle to-brand-gradient-end/60 transition-transform duration-200 group-hover:scale-x-100" />
                            )}
                        </Link>
                    </motion.div>
                ))}
            </motion.nav>
        </div>
    );
} 