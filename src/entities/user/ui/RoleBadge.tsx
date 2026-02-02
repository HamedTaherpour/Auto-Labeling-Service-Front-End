import { Badge } from "@/components/ui/badge";
import { Role, ROLE_LABELS } from "../index";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  const roleStyles = {
    owner: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    admin: "bg-red-100 text-red-800 hover:bg-red-200",
    reviewer: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    annotator: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium text-xs capitalize",
        roleStyles[role],
        className
      )}
    >
      {ROLE_LABELS[role]}
    </Badge>
  );
};