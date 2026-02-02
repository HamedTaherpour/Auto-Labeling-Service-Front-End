"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Download,
    Filter,
} from 'lucide-react';
import { format } from 'date-fns';

interface AuthLog {
    id: string;
    timestamp: string;
    userId: string;
    userEmail: string;
    action: 'login' | 'logout' | 'failed_login' | 'password_change' | 'api_access';
    status: 'success' | 'failed' | 'suspicious';
    ipAddress: string;
    userAgent: string;
    location?: string;
}

const MOCK_AUTH_LOGS: AuthLog[] = [
    {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
        userId: '1',
        userEmail: 'owner@example.com',
        action: 'login',
        status: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0.0.0',
        location: 'San Francisco, CA',
    },
    {
        id: '2',
        timestamp: '2024-01-15T10:25:00Z',
        userId: '2',
        userEmail: 'admin@example.com',
        action: 'failed_login',
        status: 'failed',
        ipAddress: '192.168.1.101',
        userAgent: 'Chrome 120.0.0.0',
        location: 'San Francisco, CA',
    },
    {
        id: '3',
        timestamp: '2024-01-15T09:15:00Z',
        userId: '3',
        userEmail: 'reviewer@example.com',
        action: 'api_access',
        status: 'success',
        ipAddress: '10.0.0.1',
        userAgent: 'Python/3.9 aiohttp/3.8.1',
    },
    {
        id: '4',
        timestamp: '2024-01-15T08:45:00Z',
        userId: '4',
        userEmail: 'unknown@example.com',
        action: 'failed_login',
        status: 'suspicious',
        ipAddress: '203.0.113.1',
        userAgent: 'Unknown',
        location: 'Unknown',
    },
];

export const AuthLogsSettings: React.FC = () => {
    const [logs] = useState<AuthLog[]>(MOCK_AUTH_LOGS);
    const [filter, setFilter] = useState<string>('all');

    const getStatusIcon = (status: AuthLog['status']) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'suspicious':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: AuthLog['status']) => {
        const variants = {
            success: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            suspicious: 'bg-yellow-100 text-yellow-800',
        };

        return (
            <Badge variant="secondary" className={variants[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getActionBadge = (action: AuthLog['action']) => {
        const labels = {
            login: 'Login',
            logout: 'Logout',
            failed_login: 'Failed Login',
            password_change: 'Password Change',
            api_access: 'API Access',
        };

        return (
            <Badge variant="outline">
                {labels[action]}
            </Badge>
        );
    };

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        return log.status === filter;
    });

    const handleExportLogs = () => {
        // In real app, this would export logs as CSV/JSON
        console.log('Exporting auth logs...');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Authentication Logs
                        </CardTitle>
                        <CardDescription>
                            Monitor authentication activities and security events across your organization.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-32">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="suspicious">Suspicious</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleExportLogs}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Location</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-mono text-sm">
                                    {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{log.userEmail}</div>
                                        <div className="text-sm text-muted-foreground">ID: {log.userId}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{getActionBadge(log.action)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(log.status)}
                                        {getStatusBadge(log.status)}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {log.location || 'Unknown'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No authentication logs found for the selected filter.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};