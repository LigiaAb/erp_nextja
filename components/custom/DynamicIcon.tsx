"use client";

import React, { memo } from "react";
import { getIconForName } from "@/lib/iconsLegacy";
import { cn } from "@/lib/utils";

interface DynamicIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export const DynamicIcon = memo(function DynamicIcon({ name, className, strokeWidth }: DynamicIconProps) {
  const IconComponent = getIconForName(name);

  return React.createElement(IconComponent, {
    className: cn("shrink-0", className),
    strokeWidth,
  });
});

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
