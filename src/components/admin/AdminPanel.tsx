/**
 * AdminPanel component - Main admin dashboard
 * Displays overview stats and admin controls
 */

'use client';

import { Block } from '@/lib/types';
import { Plus, BarChart3, Globe, Filter } from 'lucide-react';

interface AdminPanelProps {
  blocks: Block[];
  totalBlocks: number;
  onAddNew: () => void;
  children?: React.ReactNode;
}

export default function AdminPanel({ 
  blocks, 
  totalBlocks, 
  onAddNew, 
  children 
}: AdminPanelProps) {
  // Calculate stats
  const categoryStats = blocks.reduce((acc, block) => {
    acc[block.category] = (acc[block.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your blocks and monitor activity</p>
        </div>
        
        <button
          onClick={onAddNew}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Block
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Blocks */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Blocks</p>
              <p className="text-2xl font-bold text-gray-900">{totalBlocks}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Filter className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(categoryStats).length}</p>
            </div>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">
                {topCategory ? topCategory[0] : 'None'}
              </p>
              {topCategory && (
                <p className="text-sm text-gray-500">{topCategory[1]} blocks</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(categoryStats)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => {
                const percentage = totalBlocks > 0 ? (count / totalBlocks) * 100 : 0;
                return (
                  <div key={category} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-500">{count} blocks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Blocks</h3>
          {children}
        </div>
      </div>
    </div>
  );
}