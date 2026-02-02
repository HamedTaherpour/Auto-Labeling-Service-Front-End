import { Sidebar } from "@/widgets/sidebar";
import { Header } from "@/widgets/header";
import { DatasetList } from "@/features/dataset-list";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Dataset Management" />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title and Description */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Dataset Management
              </h2>
              <p className="text-gray-400 text-lg">
                Monitor and manage your auto-annotation datasets. Track
                progress, review annotations, and optimize your ML pipeline
                performance.
              </p>
            </div>

            {/* Dataset List Feature */}
            <DatasetList />
          </div>
        </main>
      </div>
    </div>
  );
}
