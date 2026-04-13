"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DotIcon } from "lucide-react";

type BreadcrumbsFromUrlProps = {
  homeLabel?: string;
  hiddenSegments?: string[];
  labels?: Record<string, string>;
};

function formatSegment(segment: string) {
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function BreadcrumbsFromUrl({ homeLabel = "Inicio", hiddenSegments = [], labels = {} }: BreadcrumbsFromUrlProps) {
  const pathname = usePathname();

  const items = React.useMemo(() => {
    if (!pathname) return [];

    const rawSegments = pathname.split("/").filter(Boolean);

    const visibleSegments = rawSegments.filter((segment) => !hiddenSegments.includes(segment));

    return visibleSegments.map((segment, index) => {
      const href = "/" + visibleSegments.slice(0, index + 1).join("/");
      const label = labels[segment] ?? formatSegment(segment);

      return {
        href,
        label,
      };
    });
  }, [pathname, hiddenSegments, labels]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link className="text-foreground" href="/">
              {homeLabel}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.href}>
              <BreadcrumbSeparator className="text-foreground">
                <DotIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground font-bold">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link className="text-foreground" href={item.href}>
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
