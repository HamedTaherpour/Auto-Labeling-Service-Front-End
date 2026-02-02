import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { TeamMember } from '@/entities/statistic';
import { Users, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamStatsWidgetProps {
  teamMembers: TeamMember[];
  className?: string;
}

export function TeamStatsWidget({ teamMembers, className }: TeamStatsWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute to refresh "live" indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getRoleBadgeVariant = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'reviewer':
        return 'secondary';
      case 'annotator':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-600';
    if (accuracy >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRejectionColor = (rejectionRate: number) => {
    if (rejectionRate <= 0.05) return 'text-green-600';
    if (rejectionRate <= 0.1) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isUserActive = (lastActive: string) => {
    const lastActiveTime = new Date(lastActive);
    const minutesSinceActive = (currentTime.getTime() - lastActiveTime.getTime()) / (1000 * 60);
    return minutesSinceActive <= 30; // Consider active if seen within last 30 minutes
  };

  const getCompletionRate = (member: TeamMember) => {
    return member.assignedFiles > 0 ? (member.completedFiles / member.assignedFiles) * 100 : 0;
  };

  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Team Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Files</TableHead>
                <TableHead className="text-center">Avg Time</TableHead>
                <TableHead className="text-center">Accuracy</TableHead>
                <TableHead className="text-center">Rejection Rate</TableHead>
                <TableHead className="text-center">Today</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => {
                const active = isUserActive(member.lastActive);
                const completionRate = getCompletionRate(member);

                return (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {active && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {active ? 'Active now' : `Last seen ${new Date(member.lastActive).toLocaleTimeString()}`}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="text-sm">
                          {member.completedFiles}/{member.assignedFiles}
                        </div>
                        <Progress value={completionRate} className="w-16 h-1" />
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{member.averageTimePerAnnotation.toFixed(1)}m</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className={cn('flex items-center justify-center gap-1', getAccuracyColor(member.accuracy))}>
                        <Target className="w-3 h-3" />
                        <span className="text-sm font-medium">
                          {(member.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className={cn('flex items-center justify-center gap-1', getRejectionColor(member.rejectionRate))}>
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-sm">
                          {(member.rejectionRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-sm font-medium">
                          {member.annotationsToday}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {teamMembers.filter(m => isUserActive(m.lastActive)).length}
            </div>
            <div className="text-xs text-muted-foreground">Active Now</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {(teamMembers.reduce((sum, m) => sum + m.accuracy, 0) / teamMembers.length * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {(teamMembers.reduce((sum, m) => sum + m.averageTimePerAnnotation, 0) / teamMembers.length).toFixed(1)}m
            </div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {teamMembers.reduce((sum, m) => sum + m.annotationsToday, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Today Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}