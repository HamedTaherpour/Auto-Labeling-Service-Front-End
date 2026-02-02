"use client";

import { useState, useEffect } from "react";
import { LayoutSelector } from "../../layout-manager";
import { OrganizeSlots } from "../../../features/organize-slots";
import { useLayoutStore } from "../../../shared/store/layout-store";
import { datasetApi } from "../../../shared/api";
import type { DatasetFile } from "../../../shared/api/dataset-api";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Settings, Files } from "lucide-react";

interface MultiViewAnnotationEditorProps {
  datasetId: string;
  itemId?: string; // For complex items with multiple files
  className?: string;
}

export function MultiViewAnnotationEditor({
  datasetId,
  itemId,
  className
}: MultiViewAnnotationEditorProps) {
  const { currentLayout, slots, loadLayoutForItem } = useLayoutStore();
  const [datasetFiles, setDatasetFiles] = useState<DatasetFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dataset files
  useEffect(() => {
    const loadDatasetFiles = async () => {
      try {
        setLoading(true);
        const files = await datasetApi.getDatasetFiles(datasetId);
        setDatasetFiles(files);
      } catch (error) {
        console.error("Failed to load dataset files:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDatasetFiles();
  }, [datasetId]);

  // Load layout for item if provided
  useEffect(() => {
    if (itemId) {
      loadLayoutForItem(itemId).catch(error => {
        console.error("Failed to load layout for item:", error);
      });
    }
  }, [itemId, loadLayoutForItem]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading annotation workspace...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Multi-View Annotation Editor</h2>
        <div className="text-sm text-gray-400">
          Layout: {currentLayout.name} • Slots: {slots.length} • Files: {datasetFiles.length}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="workspace" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#0A0A0A] border border-[#1A1A1A]">
          <TabsTrigger
            value="workspace"
            className="data-[state=active]:bg-[#FF6300] data-[state=active]:text-white"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Workspace
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="data-[state=active]:bg-[#FF6300] data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="data-[state=active]:bg-[#FF6300] data-[state=active]:text-white"
          >
            <Files className="h-4 w-4 mr-2" />
            Files ({datasetFiles.length})
          </TabsTrigger>
        </TabsList>

        {/* Workspace Tab - Main annotation area */}
        <TabsContent value="workspace" className="space-y-4">
          <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6">
            <OrganizeSlots
              datasetFiles={datasetFiles}
              className="min-h-[600px]"
            />
          </Card>
        </TabsContent>

        {/* Layout Tab - Layout configuration */}
        <TabsContent value="layout" className="space-y-4">
          <LayoutSelector />
        </TabsContent>

        {/* Files Tab - File management */}
        <TabsContent value="files" className="space-y-4">
          <Card className="bg-[#0A0A0A] border-[#1A1A1A]">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Dataset Files</h3>

              {datasetFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No files found in this dataset
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {datasetFiles.map((file) => (
                    <Card key={file.id} className="bg-[#1A1A1A] border-[#2A2A2A]">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-white truncate flex-1">
                            {file.name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            file.status === 'Complete' ? 'bg-green-500/10 text-green-400' :
                            file.status === 'Review' ? 'bg-yellow-500/10 text-yellow-400' :
                            file.status === 'Labeling' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {file.status}
                          </span>
                        </div>

                        {file.thumbnailUrl && (
                          <div className="aspect-video bg-[#2A2A2A] rounded mb-3 overflow-hidden">
                            <img
                              src={file.thumbnailUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="text-xs text-gray-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="capitalize">{file.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annotations:</span>
                            <span>{file.annotations}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span>{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Modified:</span>
                            <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}