import { Skeleton } from "~/app/_components/ui/skeleton";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const container = {
    show: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function OverviewSkeleton() {
    return (
        <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="flex items-center justify-between">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-10 w-36" />
            </motion.div>

            <motion.div variants={item} className="grid gap-4 md:grid-cols-2">
                {/* Total Money Lent Card */}
                <div className="rounded-xl bg-muted/50 p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-md bg-primary/10 p-2">
                                <Skeleton className="h-4 w-4" />
                            </div>
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-8 w-36" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                {/* Total Money Borrowed Card */}
                <div className="rounded-xl bg-muted/50 p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-md bg-primary/10 p-2">
                                <Skeleton className="h-4 w-4" />
                            </div>
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-8 w-36" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={item} className="grid gap-4 md:grid-cols-2">
                {/* Recent Loans Given */}
                <div className="rounded-xl bg-muted/50 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                className="flex items-center justify-between rounded-lg bg-background/50 p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-md bg-primary/10 p-2">
                                        <Skeleton className="h-4 w-4" />
                                    </div>
                                    <div className="grid gap-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-4" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recent Loans Received */}
                <div className="rounded-xl bg-muted/50 p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                className="flex items-center justify-between rounded-lg bg-background/50 p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-md bg-primary/10 p-2">
                                        <Skeleton className="h-4 w-4" />
                                    </div>
                                    <div className="grid gap-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-4" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
} 