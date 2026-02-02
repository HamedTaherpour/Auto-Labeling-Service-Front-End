import Link from "next/link";
import { Database, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6300]">
            <Database className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">AuraVision</h1>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Auto-Annotation Dashboard
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to the internal dashboard for AuraVision's auto-annotation service.
            Manage datasets, monitor annotation progress, and optimize your machine learning pipeline.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF6300] hover:bg-[#FF6300]/90 text-white font-medium rounded-lg transition-colors"
          >
            Enter Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
            <Database className="h-8 w-8 text-[#FF6300] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Dataset Management</h3>
            <p className="text-gray-400 text-sm">
              Upload, organize, and track your annotation datasets with real-time progress monitoring.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
            <div className="h-8 w-8 bg-[#FF6300] rounded mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Auto-Annotation</h3>
            <p className="text-gray-400 text-sm">
              Leverage advanced AI models including RexOmni and Florence for automated annotation tasks.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
            <div className="h-8 w-8 bg-[#FF6300] rounded mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-sm">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analytics & Insights</h3>
            <p className="text-gray-400 text-sm">
              Monitor performance metrics, track annotation quality, and optimize your ML workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
