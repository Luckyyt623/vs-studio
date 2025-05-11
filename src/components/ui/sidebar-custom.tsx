"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter as ShadSheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Context for sidebar state
type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider_legacy = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar_legacy = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar_legacy must be used within a SidebarProvider_legacy");
  }
  return context;
};


// Main Sidebar Component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right";
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, open, onOpenChange, side = "left", ...props }, ref) => {
    const isMobile = useIsMobile();
    const [internalOpen, setInternalOpen] = React.useState(false);

    const currentOpen = open !== undefined ? open : internalOpen;
    const setCurrentOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

    if (isMobile) {
      return (
        <Sheet open={currentOpen} onOpenChange={setCurrentOpen}>
          <SheetContent side={side} className={cn("w-[280px] p-0 flex flex-col bg-sidebar text-sidebar-foreground", className)}>
            {children}
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "hidden md:flex flex-col h-full w-[280px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          !currentOpen && "hidden", // Simple hide/show for desktop controlled by parent
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";


// Sidebar Header
export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 border-b border-sidebar-border", className)} {...props} />
  )
);
SidebarHeader.displayName = "SidebarHeader";

// Sidebar Title (simplified from SheetTitle)
export const SidebarTitle = React.forwardRef<
  React.ElementRef<typeof SheetTitle>,
  React.ComponentPropsWithoutRef<typeof SheetTitle>
>(({ className, ...props }, ref) => (
  <SheetTitle
    ref={ref}
    className={cn("text-lg font-semibold flex items-center text-sidebar-foreground", className)}
    {...props}
  />
));
SidebarTitle.displayName = "SidebarTitle";


// Sidebar Content
export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-grow p-4 overflow-y-auto", className)} {...props} />
  )
);
SidebarContent.displayName = "SidebarContent";

// Sidebar Footer
export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <ShadSheetFooter ref={ref} className={cn("p-4 border-t border-sidebar-border bg-sidebar", className)} {...props} />
    )
  );
SidebarFooter.displayName = "SidebarFooter";

// Sidebar Group (for semantic grouping)
export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  )
);
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1", className)} {...props}>
      {children}
    </h3>
  )
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props} />
  )
);
SidebarGroupContent.displayName = "SidebarGroupContent";


// Sidebar Trigger (for mobile, to be placed in main content area's header)
interface SidebarTriggerProps extends React.ComponentPropsWithoutRef<typeof Button> { }

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    // const { setIsOpen } = useSidebar_legacy(); // If using context based provider
    // For direct control via page.tsx state:
    // This trigger might need to be connected to the state in page.tsx
    // For now, it's a simple button. The page.tsx example uses its own button.
    // This ShadCN SidebarTrigger is more for the complex SidebarProvider.
    // For this simplified custom component, the trigger is effectively managed by the parent page.
    
    // Fallback to ShadCN's Button if used in a context that expects it.
    // In CodeWriteMobilePage, a Button with PanelLeft is used.
    return (
       <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("md:hidden", className)} // Typically hidden on desktop
        onClick={onClick} // onClick should control the 'open' state in the parent
        {...props}
      >
        <PanelLeft className="w-5 h-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";


// SidebarInset (Main content area wrapper)
export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 flex flex-col overflow-hidden", className)}
      {...props}
    />
  )
);
SidebarInset.displayName = "SidebarInset";
