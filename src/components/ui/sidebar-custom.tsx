"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader as ShadSheetHeaderImport, SheetTitle, SheetFooter as ShadSheetFooter } from "@/components/ui/sheet"; // SheetTitle is DialogPrimitive.Title
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Context for sidebar state (legacy, not used by page.tsx directly for this custom sidebar)
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
          !currentOpen && "hidden",
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

// Sidebar Title
// Uses SheetTitle (DialogPrimitive.Title) on mobile, and a simple <h2> on desktop.
export const SidebarTitle = React.forwardRef<
  HTMLHeadingElement, // Ref will be to an h2 or the element SheetTitle renders as (h2 by default)
  React.ComponentPropsWithoutRef<typeof SheetTitle> // Props compatible with SheetTitle (and thus h2)
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // On mobile, it's rendered within a Sheet context, so use SheetTitle from sheet.tsx
    return (
      <SheetTitle // This is from "@/components/ui/sheet", which is DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold flex items-center text-sidebar-foreground", className)}
        {...props}
      >
        {children}
      </SheetTitle>
    );
  }

  // On desktop, render as a simple h2 tag.
  // SheetTitle from sheet.tsx (DialogPrimitive.Title) also defaults to an h2.
  // The props are compatible.
  return (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold flex items-center text-sidebar-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  );
});
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


// Sidebar Trigger
interface SidebarTriggerProps extends React.ComponentPropsWithoutRef<typeof Button> { }

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    return (
       <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("md:hidden", className)} 
        onClick={onClick} 
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
