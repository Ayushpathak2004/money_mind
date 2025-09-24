// toggle-group.jsx
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext(null);

const ToggleGroup = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ variant, size }), [variant, size]);

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        <ToggleGroupContext.Provider value={contextValue}>
          {props.children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  }
);
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef(
  ({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    
    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors data-[state=on]:bg-accent data-[state=on]:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground",
          context?.variant === "outline" && "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
          context?.size === "sm" && "h-9 px-2.5",
          context?.size === "default" && "h-10 px-3",
          context?.size === "lg" && "h-11 px-5",
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );
  }
);
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };