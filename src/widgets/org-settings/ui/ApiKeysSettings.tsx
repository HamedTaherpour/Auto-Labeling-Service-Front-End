"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Key,
    Plus,
    MoreHorizontal,
    Copy,
    Trash2,
    Eye,
    EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed?: string;
    permissions: string[];
}

const MOCK_API_KEYS: ApiKey[] = [
    {
        id: '1',
        name: 'Production API',
        key: 'ak_prod_1234567890abcdef',
        createdAt: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-15T10:30:00Z',
        permissions: ['read', 'write', 'delete'],
    },
    {
        id: '2',
        name: 'Development API',
        key: 'ak_dev_abcdef1234567890',
        createdAt: '2024-01-05T00:00:00Z',
        permissions: ['read', 'write'],
    },
];

export const ApiKeysSettings: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

    const generateApiKey = () => {
        return `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    };

    const handleCreateKey = () => {
        if (!newKeyName.trim()) {
            toast.error('Please enter a name for the API key');
            return;
        }

        const newKey: ApiKey = {
            id: Date.now().toString(),
            name: newKeyName.trim(),
            key: generateApiKey(),
            createdAt: new Date().toISOString(),
            permissions: ['read'],
        };

        setApiKeys(prev => [...prev, newKey]);
        setNewKeyName('');
        setIsCreateDialogOpen(false);
        toast.success('API key created successfully!');
    };

    const handleDeleteKey = (keyId: string) => {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
        toast.success('API key deleted successfully!');
    };

    const handleCopyKey = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success('API key copied to clipboard!');
    };

    const toggleKeyVisibility = (keyId: string) => {
        setVisibleKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(keyId)) {
                newSet.delete(keyId);
            } else {
                newSet.add(keyId);
            }
            return newSet;
        });
    };

    const maskApiKey = (key: string) => {
        return `${key.substring(0, 8)}${'•'.repeat(key.length - 16)}${key.substring(key.length - 8)}`;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                API Keys
                            </CardTitle>
                            <CardDescription>
                                Manage API keys for developer access to your organization's data.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create API Key
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>API Key</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Used</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apiKeys.map((apiKey) => (
                                <TableRow key={apiKey.id}>
                                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleKeyVisibility(apiKey.id)}
                                            >
                                                {visibleKeys.has(apiKey.id) ? (
                                                    <EyeOff className="h-3 w-3" />
                                                ) : (
                                                    <Eye className="h-3 w-3" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {apiKey.permissions.map((permission) => (
                                                <Badge key={permission} variant="outline" className="text-xs">
                                                    {permission}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(apiKey.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {apiKey.lastUsed
                                            ? formatDistanceToNow(new Date(apiKey.lastUsed), { addSuffix: true })
                                            : 'Never'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleCopyKey(apiKey.key)}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Copy Key
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteKey(apiKey.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Key
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {apiKeys.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No API keys created yet. Create your first API key to get started.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create API Key</DialogTitle>
                        <DialogDescription>
                            Create a new API key for developer access. Make sure to copy and store it securely.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="key-name">API Key Name</Label>
                            <Input
                                id="key-name"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="e.g., Production API, Development API"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateKey}>Create Key</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};