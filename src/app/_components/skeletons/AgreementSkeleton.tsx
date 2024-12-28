import { Skeleton } from "~/app/_components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
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

export function AgreementSkeleton() {
    return (
        <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-7 w-48" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <motion.div variants={item} className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-8 w-36" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-8 w-36" />
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="grid gap-4">
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    variants={item}
                                    className="flex items-center justify-between"
                                >
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-24" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="flex justify-end space-x-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
} 