/**
 * BlockGrid component - Main grid layout for blocks
 * Handles responsive grid display, filtering, and loading states
 */

'use client';

import { Block } from '@/lib/types';
import BlockCard from './BlockCard';
import { Loader2, Search, Grid3X3 } from 'lucide-react';

interface BlockGridProps {
  blocks: Block[];
  loading?: boolean;
  isAdminMode?: boolean;
  onEdit?: (block: Block) => void;
  onDelete?: (id: number) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

// Available categories for filtering
const CATEGORIES = [
  'All',
  'Technology',
  'E-Commerce',
  'Education',
  'Health & Fitness',
  'Finance',
  'Entertainment'
];

export default function BlockGrid({
  blocks,
  loading = false,
  isAdminMode = false,
  onEdit,
  onDelete,
  searchTerm = '',
  onSearchChange,
  selectedCategory = 'All',
  onCategoryChange
}: BlockGridProps) {
  // Filter blocks based on search and category
  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = !searchTerm || 
      block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search blocks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        )}

        {/* Category Filter */}
        {onCategoryChange && (
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading blocks...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBlocks.length === 0 && (
        <div className="text-center py-12">
          <Grid3X3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'All' ? 'No blocks found' : 'No blocks yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first block to get started.'
            }
          </p>
        </div>
      )}

      {/* Blocks Grid */}
      {!loading && filteredBlocks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlocks.map((block, index) => (
            <div
              key={block.id}
              className="animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <BlockCard
                block={block}
                isAdminMode={isAdminMode}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && filteredBlocks.length > 0 && (
        <div className="text-center mt-8 text-sm text-gray-500">
          Showing {filteredBlocks.length} of {blocks.length} blocks
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      )}
    </div>
  );
}