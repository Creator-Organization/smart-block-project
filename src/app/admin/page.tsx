/**
 * Admin Dashboard Page - With Theme Support
 * Full admin interface with color themes
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBlocks } from '@/hooks/useBlocks';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Block, CreateBlockRequest, UpdateBlockRequest } from '@/lib/types';
import AdminPanel from '@/components/admin/AdminPanel';
import AddBlockModal from '@/components/admin/AddBlockModal';
import EditBlockModal from '@/components/admin/EditBlockModal';
import BlockGrid from '@/components/blocks/BlockGrid';
import FloatingBackground from '@/components/ui/FloatingBackground';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { ArrowLeft, Sparkles, Plus, Grid3X3, BarChart3, Activity } from 'lucide-react';

export default function AdminPage() {
  const { blocks, loading, error, totalBlocks, createBlock, updateBlock, deleteBlock } = useBlocks();
  const { theme, isDarkMode } = useTheme();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  // Handle edit block
  const handleEdit = (block: Block) => {
    setEditingBlock(block);
    setShowEditModal(true);
  };

  // Handle delete block
  const handleDelete = async (id: number) => {
    await deleteBlock(id);
  };

  // Handle block reordering
  const handleReorder = async (reorderedBlocks: Block[]) => {
    // Update local state optimistically
    console.log('Blocks reordered:', reorderedBlocks.map(b => b.title));
  };

  // Handle add block
  const handleAddBlock = async (data: CreateBlockRequest) => {
    const result = await createBlock(data);
    if (result) {
      setShowAddModal(false);
    }
  };

  // Handle update block
  const handleUpdateBlock = async (id: number, data: UpdateBlockRequest) => {
    const result = await updateBlock(id, data);
    if (result) {
      setShowEditModal(false);
      setEditingBlock(null);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? theme.gradientDark : theme.gradient} relative overflow-hidden`}>
      {/* Floating Background Elements */}
      <FloatingBackground />

      {/* Theme Toggle Button */}
      <ThemeToggleButton />

      {/* Header */}
      <header className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="btn-3d flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg interactive-scale"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Link>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6" style={{ color: theme.accent }} />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Smart Blocks Admin</span>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-3d flex items-center px-4 py-2 text-white rounded-lg transition-colors shadow-md interactive-scale"
                style={{ backgroundColor: theme.accent }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 glass-effect">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Blocks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBlocks}</p>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.accent}20` }}>
                <Grid3X3 className="h-6 w-6" style={{ color: theme.accent }} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 glass-effect">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 glass-effect">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Today</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div className="absolute h-3 w-3 bg-green-500 rounded-full pulse-new"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg glass-effect">
            <p className="text-red-800 dark:text-red-300 text-center">{error}</p>
          </div>
        )}

        {/* Admin Panel */}
        <AdminPanel
          blocks={blocks}
          totalBlocks={totalBlocks}
          onAddNew={() => setShowAddModal(true)}
        >
          {/* Admin Instructions with Theme Color */}
          <div 
            className="border rounded-lg p-4 mb-8 glass-effect"
            style={{ 
              backgroundColor: `${theme.accent}10`,
              borderColor: `${theme.accent}40`
            }}
          >
            <h3 className="font-medium mb-2" style={{ color: theme.accent }}>Admin Features</h3>
            <ul className="text-sm space-y-1" style={{ color: `${theme.accent}dd` }}>
              <li>• Drag and drop blocks to reorder them</li>
              <li>• Click on any block to edit or delete</li>
              <li>• Use the search and filter options to find specific blocks</li>
              <li>• Add new blocks using the "Add Block" button</li>
            </ul>
          </div>

          {/* Block Grid in Admin Mode with Drag & Drop */}
          <BlockGrid
            blocks={blocks}
            loading={loading}
            isAdminMode={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReorder={handleReorder}
            enableDragDrop={true}
          />
        </AdminPanel>
      </main>

      {/* Add Block Modal */}
      {showAddModal && (
        <AddBlockModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddBlock}
        />
      )}

      {/* Edit Block Modal */}
      {showEditModal && editingBlock && (
        <EditBlockModal
          isOpen={showEditModal}
          block={editingBlock}
          onClose={() => {
            setShowEditModal(false);
            setEditingBlock(null);
          }}
          onSubmit={handleUpdateBlock}
        />
      )}
    </div>
  );
}