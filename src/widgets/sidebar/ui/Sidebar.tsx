import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  BarChart3,
  Settings,
  Users,
  FileText,
  Zap,
  Home,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    isActive: true,
  },
  {
    title: "Datasets",
    icon: Database,
    href: "/dashboard/datasets",
    isActive: false,
  },
  {
    title: "Jobs",
    icon: Zap,
    href: "/dashboard/jobs",
    isActive: false,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    isActive: false,
  },
];

const secondaryItems = [
  {
    title: "Team",
    icon: Users,
    href: "/dashboard/team",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/dashboard/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-[#0A0A0A] border-r border-[#1A1A1A]",
        className
      )}
    >
      {/* Logo/Brand */}
      <div className="flex h-16 items-center px-6 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6300]">
            <Database className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">AuraVision</h1>
            <p className="text-xs text-gray-400">Internal Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant={item.isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  item.isActive
                    ? "bg-[#FF6300]/10 text-[#FF6300] border border-[#FF6300]/20 hover:bg-[#FF6300]/20"
                    : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.title}
                  {item.isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>

              </Button>
            );
          })}
        </div>

        <Separator className="my-6 bg-[#1A1A1A]" />

        <div className="space-y-2">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant="ghost"
                className="w-full justify-start gap-3 h-10 text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1A1A1A]">
        <div className="text-xs text-gray-500">
          <p>Auto-Annotation Service</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
