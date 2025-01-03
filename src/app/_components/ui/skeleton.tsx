import { cn } from "~/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-md bg-muted animate-pulse",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-[shimmer_2s_infinite]"
        style={{ transform: "translateX(-100%)" }}
      />
    </div>
  )
}

export { Skeleton }
