import * as React from "react"

import { cn } from "@/shared/lib/utils"
function Input({ className, type, iconBefore, ...props }: React.ComponentProps<"input"> & { iconBefore?: React.ReactNode }) {
  return (
    <div className="relative flex">
      {iconBefore && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          {iconBefore}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
          iconBefore ? "pl-10" : ""  // Adjust padding if icon is present
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
