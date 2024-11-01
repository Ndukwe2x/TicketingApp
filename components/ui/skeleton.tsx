import { cn } from "@/lib/utils"
import { IoImageOutline } from "react-icons/io5"
import { IconType } from "react-icons/lib"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-400/40", className)}
      {...props}
    />
  )
}

function ImageSkeleton({
  className,
  width,
  height,
  ...props
}: React.HTMLAttributes<SVGElement> & { width: string | number; height: string | number }) {
  return (
    <IoImageOutline className={cn("animate-pulse rounded-md bg-gray-400/40", className)}
      {...props} />
  )
}

export { Skeleton, ImageSkeleton }
