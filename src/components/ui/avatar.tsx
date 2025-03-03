"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/shared/lib/utils"

function AvatarWrapper({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

function Avatar({
  src,
  alt,
  fallback,
  className,
  ...props
}: {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
}) {
  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  };

  return (
    <AvatarWrapper className={className} {...props}>
      {src && (
        <AvatarImage src={src} alt={alt} />
      )}
      <AvatarFallback>{getInitials(fallback)}</AvatarFallback>
    </AvatarWrapper>
  );
}

export { Avatar, AvatarWrapper, AvatarImage, AvatarFallback }
