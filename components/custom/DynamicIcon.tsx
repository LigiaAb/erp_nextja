"use client";

import React, { memo } from "react";
import { getIconForName } from "@/lib/iconsLegacy";
import { cn } from "@/lib/utils";

interface DynamicIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
  size?: number;
  style?: React.CSSProperties;
}

export const DynamicIcon = memo(function DynamicIcon({ style, name, size, className, strokeWidth }: DynamicIconProps) {
  const IconComponent = getIconForName(name);

  return React.createElement(IconComponent, {
    className: cn("shrink-0", className),
    size,
    strokeWidth,
    style,
  });
});

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
