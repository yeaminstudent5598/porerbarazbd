"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/app/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

// ✅ --- সমাধান শুরু ---
// Radix-এর Viewport একটি <ol> এলিমেন্ট, তাই টাইপটি সরাসরি Radix থেকে নেওয়া হলো।
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-[390px] max-w-full m-0 list-none z-[999]",
      className // props.className এর বদলে className ব্যবহার করা হলো
    )}
    {...props}
  />
));
// displayName সরাসরি Radix থেকে নেওয়া হলো
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
// ✅ --- সমাধান শেষ ---


const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentProps<typeof ToastPrimitives.Root>
>((props, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(
      "bg-white border rounded-md p-4 shadow-md grid gap-2",
      props.className
    )}
    {...props}
  />
));
Toast.displayName = "Toast";

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentProps<typeof ToastPrimitives.Title>
>((props, ref) => (
  <ToastPrimitives.Title ref={ref} className="font-semibold text-sm" {...props} />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentProps<typeof ToastPrimitives.Description>
>((props, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className="text-sm text-muted-foreground"
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

const ToastAction = ToastPrimitives.Action;

export { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastAction };