import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

interface LoadingStateProps {
    text?: string;
    className?: string;
}

export function LoadingState({ text = "Loading...", className }: LoadingStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    );
} 