/**
 * BlockGrid component - Updated with 2 columns layout
 * Handles responsive grid display, filtering, and reordering
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Block } from '@/lib/types';
import { useSearch } from '@/hooks/useSearch';
import { useTheme } from '@/components/ui/ThemeProvider';
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
  const { theme } = useTheme();

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
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        {/* Fixed Search Bar */}
        <div ref={searchRef} className="relative max-w-xl mx-auto">
          <div className="search-enhanced relative rounded-full shadow-md border-2 border-transparent">
            <div className="flex items-center px-6 py-4">
              <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearchHistory(true)}
                placeholder="Search blocks..."
                className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors interactive-scale"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Search History Dropdown */}
          {showSearchHistory && searchHistory.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden z-10 glass-effect animate-fadeIn border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <History className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Recent searches</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear all
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleHistorySelect(term)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 interactive-scale"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 interactive-scale
                ${selectedCategory === category
                  ? 'category-pill-active'
                  : 'category-pill hover:shadow-md'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </span>
            <button
              onClick={clearSearch}
              className="font-medium interactive-scale"
              style={{ color: theme.accent }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.accent }} />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading blocks...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBlocks.length === 0 && (
        <div className="text-center py-12">
          <Grid3X3 className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {hasActiveFilters ? 'No blocks found' : 'No blocks yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {hasActiveFilters
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first block to get started.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearSearch}
              className="px-4 py-2 text-white rounded-lg transition-colors interactive-scale"
              style={{ backgroundColor: theme.accent }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Blocks Grid - UPDATED TO 2 COLUMNS */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {filteredBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className="animate-fadeInUp"
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
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-500">
          Showing {filteredBlocks.length} of {blocks.length} blocks
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      )}
    </div>
  );
}