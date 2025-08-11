import { Button } from "./button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface CommunityButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'hero' | 'community' | 'accent' | 'default'
  size?: 'default' | 'sm' | 'lg'
  children: React.ReactNode
}

export const CommunityButton = forwardRef<HTMLButtonElement, CommunityButtonProps>(
  ({ variant = 'default', size = 'default', className, children, ...props }, ref) => {
    const baseClasses = "transition-all duration-300"
    
    const variantClasses = {
      hero: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105",
      community: "bg-gradient-community text-secondary-foreground hover:shadow-card",
      accent: "bg-accent text-accent-foreground hover:bg-accent/90",
      default: "bg-primary text-primary-foreground hover:bg-primary/90"
    }

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8"
    }

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

CommunityButton.displayName = "CommunityButton"