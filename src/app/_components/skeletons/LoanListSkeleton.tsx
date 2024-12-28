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

export function LoanListSkeleton() {
    return (
        <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="flex items-center justify-between">
                <Skeleton className="h-9 w-48" />
            </motion.div>

            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="rounded-xl bg-muted/50 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-32" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-9 w-28" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 