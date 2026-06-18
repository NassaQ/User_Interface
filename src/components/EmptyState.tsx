/**
 * EmptyState — Reusable placeholder for list pages that have no data yet.
 *
 * Usage:
 *   <EmptyState
 *     icon={<FileText className="w-8 h-8" />}
 *     title="No documents found"
 *     description="Upload your first document to get started."
 *     action={{ label: "Upload Document", href: "/upload" }}
 *   />
 */

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Action {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: Action;
  secondaryAction?: Action;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
          <div className="text-muted-foreground">{icon}</div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}

      <div className="flex items-center gap-3">
        {action && (action.href ? (
          <Button asChild className="gap-2">
            <Link to={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button className="gap-2" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}

        {secondaryAction && (secondaryAction.href ? (
          <Button asChild variant="outline" className="gap-2">
            <Link to={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        ) : (
          <Button variant="outline" className="gap-2" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;
