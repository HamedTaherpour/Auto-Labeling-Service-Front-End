import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "../index";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    user: User;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const UserAvatar = ({ user, size = "md", className }: UserAvatarProps) => {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Avatar className={cn(sizeClasses[size], className)}>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs font-medium">
                {getInitials(user.name)}
            </AvatarFallback>
        </Avatar>
    );
};