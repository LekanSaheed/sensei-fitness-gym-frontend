import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { cldImage } from "@/utils/images";
import React from "react";

/** "Ada Obi" -> "AO", "Ada" -> "A" (never throws on odd names) */
export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";

/** Member photo, or their initials when they haven't uploaded one */
const LeaderAvatar = ({
  name,
  image,
  className,
  fallbackClassName,
}: {
  name: string;
  image: string | null;
  className?: string;
  fallbackClassName?: string;
}) => (
  <Avatar className={cn("size-10", className)}>
    {image && (
      // Small square thumbnail instead of the full-size upload
      <AvatarImage
        src={cldImage(image, { width: 192, height: 192 })}
        alt={name}
        className="object-cover"
      />
    )}
    <AvatarFallback
      className={cn(
        "bg-default/15 text-default-secondary font-semibold",
        fallbackClassName
      )}
    >
      {initialsOf(name)}
    </AvatarFallback>
  </Avatar>
);

export default LeaderAvatar;
