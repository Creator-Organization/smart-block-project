/**
 * Admin Dashboard Page - Enhanced
 * Full admin interface for managing blocks
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBlocks } from '@/hooks/useBlocks';
import { Block, CreateBlockRequest, UpdateBlockRequest } from '@/lib/types';
import AdminPanel from '@/components/admin/AdminPanel';
import AddBlockModal from '@/components/admin/AddBlockModal';
import EditBlockModal from '@/components/admin/EditBlockModal';
import BlockGrid from '@/components/blocks/BlockGrid';
import { ArrowLeft, Sparkles, Plus, Grid3X3 } from 'lucide-react';

export default function AdminPage() {
  const { blocks, loading, error, totalBlocks, createBlock, updateBlock, deleteBlock } = useBlocks();
  
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
    // The actual API call will be handled by the drag & drop hook
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="btn-3d flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg interactive-scale"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Link>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-gray-900">Smart Blocks Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 glass-effect">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Blocks</p>
                <p className="text-2xl font-bold text-gray-900">{totalBlocks}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Grid3X3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 glass-effect">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 glass-effect">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-2xl font-bold text-gray-900">Today</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full pulse-new"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg glass-effect">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Admin Panel */}
        <AdminPanel
          blocks={blocks}
          totalBlocks={totalBlocks}
          onAddNew={() => setShowAddModal(true)}
        >
          {/* Admin Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 glass-effect">
            <h3 className="font-medium text-blue-900 mb-2">Admin Features</h3>
            <ul className="text-sm text-blue-800 space-y-1">
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