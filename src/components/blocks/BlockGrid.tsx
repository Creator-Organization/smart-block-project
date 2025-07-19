/**
 * BlockGrid component - Enhanced with drag & drop and advanced search
 * Handles responsive grid display, filtering, and reordering
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Block } from '@/lib/types';
import { useSearch } from '@/hooks/useSearch';
import BlockCard from './BlockCard';
import DragDropGrid from './DragDropGrid';
import { Loader2, Search, Grid3X3, X, History, Filter } from 'lucide-react';

interface BlockGridProps {
  blocks: Block[];
  loading?: boolean;
  isAdminMode?: boolean;
  onEdit?: (block: Block) => void;
  onDelete?: (id: number) => void;
  onReorder?: (reorderedBlocks: Block[]) => void;
  enableDragDrop?: boolean;
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
  onReorder,
  enableDragDrop = false
}: BlockGridProps) {
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Use advanced search hook
  const {
    searchTerm,
    selectedCategory,
    filteredBlocks,
    setSearchTerm,
    setSelectedCategory,
    clearSearch,
    searchHistory,
    clearHistory,
    totalResults,
    hasActiveFilters,
  } = useSearch(blocks);

  // Handle click outside to close search history
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle block reordering
  const handleReorder = (reorderedBlocks: Block[]) => {
    onReorder?.(reorderedBlocks);
  };

  // Handle search history selection
  const handleHistorySelect = (term: string) => {
    setSearchTerm(term);
    setShowSearchHistory(false);
  };

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Advanced Search Bar */}
        <div className="relative max-w-md mx-auto" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search blocks... (start typing)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSearchHistory(true)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          
          {/* Search Actions */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {searchHistory.length > 0 && (
              <button
                onClick={() => setShowSearchHistory(!showSearchHistory)}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                title="Search history"
              >
                <History className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search History Dropdown */}
          {showSearchHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
              <div className="p-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Recent searches</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Clear all
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleHistorySelect(term)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
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

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </span>
            <button
              onClick={clearSearch}
              className="text-sm text-blue-500 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
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
            {hasActiveFilters ? 'No blocks found' : 'No blocks yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first block to get started.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Blocks Grid */}
      {!loading && filteredBlocks.length > 0 && (
        <>
          {enableDragDrop && isAdminMode ? (
            <DragDropGrid
              blocks={filteredBlocks}
              isAdminMode={isAdminMode}
              onEdit={onEdit}
              onDelete={onDelete}
              onReorder={handleReorder}
            />
          ) : (
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
        </>
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