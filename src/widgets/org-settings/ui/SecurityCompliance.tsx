"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Calendar,
} from 'lucide-react';

interface ComplianceStatus {
  framework: string;
  status: 'compliant' | 'pending' | 'non_compliant';
  lastAudit: string;
  nextAudit: string;
  certificateUrl?: string;
  description: string;
}

const COMPLIANCE_DATA: ComplianceStatus[] = [
  {
    framework: 'SOC 2 Type II',
    status: 'compliant',
    lastAudit: '2024-01-01',
    nextAudit: '2025-01-01',
    certificateUrl: '#',
    description: 'Service Organization Control 2 - Security, Availability, and Confidentiality',
  },
  {
    framework: 'HIPAA',
    status: 'compliant',
    lastAudit: '2024-01-01',
    nextAudit: '2025-01-01',
    certificateUrl: '#',
    description: 'Health Insurance Portability and Accountability Act compliance',
  },
  {
    framework: 'GDPR',
    status: 'pending',
    lastAudit: '2023-12-01',
    nextAudit: '2024-06-01',
    description: 'General Data Protection Regulation compliance assessment in progress',
  },
  {
    framework: 'ISO 27001',
    status: 'compliant',
    lastAudit: '2024-01-01',
    nextAudit: '2025-01-01',
    certificateUrl: '#',
    description: 'Information Security Management Systems standard',
  },
];

export const SecurityCompliance: React.FC = () => {
  const getStatusIcon = (status: ComplianceStatus['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'non_compliant':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ComplianceStatus['status']) => {
    const variants = {
      compliant: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      non_compliant: 'bg-red-100 text-red-800',
    };

    const labels = {
      compliant: 'Compliant',
      pending: 'Pending',
      non_compliant: 'Non-Compliant',
    };

    return (
      <Badge variant="secondary" className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Compliance
          </CardTitle>
          <CardDescription>
            Monitor your organization's compliance status with industry security standards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {COMPLIANCE_DATA.map((compliance) => (
              <Card key={compliance.framework} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{compliance.framework}</CardTitle>
                    {getStatusIcon(compliance.status)}
                  </div>
                  <CardDescription className="text-sm">
                    {compliance.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(compliance.status)}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last Audit: {formatDate(compliance.lastAudit)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Next Audit: {formatDate(compliance.nextAudit)}</span>
                  </div>

                  {compliance.certificateUrl && (
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      View Certificate
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>
            Summary of your organization's security compliance posture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {COMPLIANCE_DATA.filter(c => c.status === 'compliant').length}
              </div>
              <div className="text-sm text-green-700">Compliant</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {COMPLIANCE_DATA.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {COMPLIANCE_DATA.filter(c => c.status === 'non_compliant').length}
              </div>
              <div className="text-sm text-red-700">Non-Compliant</div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Security Best Practices</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Regular security audits and penetration testing</li>
              <li>• Multi-factor authentication for all users</li>
              <li>• Encrypted data transmission and storage</li>
              <li>• Regular backup and disaster recovery testing</li>
              <li>• Employee security awareness training</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};