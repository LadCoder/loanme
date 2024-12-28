import { Skeleton } from "~/app/_components/ui/skeleton";
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

export function BorrowedLoansSkeleton() {
    return (
        <motion.div
            className="space-y-8 animate-pulse"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="flex items-center justify-between">
                <Skeleton className="h-10 w-48" />
            </motion.div>

            <motion.div variants={item} className="grid gap-4">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-background/50 p-4"
                    >
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-9 w-9 rounded-md" />
                            <div className="grid gap-1">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                        <div className="grid gap-1 text-right">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
} 