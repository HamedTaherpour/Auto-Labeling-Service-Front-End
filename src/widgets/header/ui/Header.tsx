import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NotificationCenterWidget } from "@/widgets/notification-center";
import {
  Search,
  Plus,
  Settings,
  ChevronDown,
  Database,
} from "lucide-react";

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ title = "Dashboard", className }: HeaderProps) {
  return (
    <header
      className={`flex h-16 items-center justify-between bg-[#0A0A0A] border-b border-[#1A1A1A] px-6 ${className}`}
    >
      {/* Left Section - Title and Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#FF6300]" />
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>
        <Separator orientation="vertical" className="h-6 bg-[#1A1A1A]" />
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Dataset Management</span>
        </div>
      </div>

      {/* Right Section - Actions and User */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
          >
            <Search className="h-4 w-4" />
          </Button>

          <NotificationCenterWidget />

          <Separator orientation="vertical" className="h-6 bg-[#1A1A1A]" />

          <Button
            size="sm"
            className="bg-[#FF6300] hover:bg-[#FF6300]/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Dataset
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#1A1A1A]" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-gray-400">Senior Engineer</p>
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-[#FF6300] text-white text-sm">
              JD
            </AvatarFallback>
          </Avatar>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#1A1A1A] p-1"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
