import { TableBody, TableCell, TableRow } from "~/app/_components/ui/table";

export function LoanTableSkeleton() {
    return (
        <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-muted/50">
                    <TableCell className="w-[120px] whitespace-nowrap">
                        <div className="h-6 w-[100px] rounded bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell className="w-[200px] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 shrink-0 rounded-full bg-muted animate-pulse" />
                            <div className="h-6 w-[160px] rounded bg-muted animate-pulse" />
                        </div>
                    </TableCell>
                    <TableCell className="w-[100px] whitespace-nowrap">
                        <div className="h-6 w-[80px] rounded bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell className="w-[120px] whitespace-nowrap">
                        <div className="h-6 w-[100px] rounded bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell className="w-[100px] whitespace-nowrap">
                        <div className="h-6 w-[70px] rounded bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell className="w-[100px] whitespace-nowrap">
                        <div className="h-6 w-[80px] rounded bg-muted animate-pulse" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
} 