import React from "react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

export interface DivProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> { }

export const FilterTools = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, subject, ...props }, ref) => {
    return (
      <div
        className={cn(className)}
        ref={ref}
        {...props}>
        <div className="search-tool">
          <Input className="py-8" type="search" id="search-tool" placeholder={`Search ${subject}`} />
        </div>
      </div>
    )
  }
)

FilterTools.displayName = 'FilterTools';