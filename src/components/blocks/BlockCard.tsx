/**
 * BlockCard component - Enhanced with dark mode support
 * Shows block information with hover effects and actions
 */

'use client';

import { Block } from '@/lib/types';
import { ExternalLink, Edit, Trash2, Sparkles, Link2 } from 'lucide-react';
import { useState } from 'react';

interface BlockCardProps {
  block: Block;
  isAdminMode?: boolean;
  onEdit?: (block: Block) => void;
  onDelete?: (id: number) => void;
  isNew?: boolean;
}

// Helper function to get domain from URL
const getDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function BlockCard({ 
  block, 
  isAdminMode = false, 
  onEdit, 
  onDelete,
  isNew = false 
}: BlockCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (!isAdminMode) {
      window.open(block.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(block);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this block?')) {
      onDelete?.(block.id);
    }
  };

  // Generate favicon URL
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${getDomainFromUrl(block.url)}&sz=64`;

  return (
    <div
      className={`
        block-card gradient-border card-shine group relative 
        bg-white dark:bg-gray-800 rounded-lg
        transition-all duration-300 transform
        border border-gray-200 dark:border-gray-700 overflow-hidden
        ${!isAdminMode ? 'cursor-pointer hover:border-transparent' : ''}
        ${isNew ? 'pulse-new' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Color Header with Glow Effect */}
      <div className={`
        h-32 ${block.color} color-glow relative overflow-hidden
        transition-all duration-300 group-hover:h-36
      `}>
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10" />
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`dots-${block.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dots-${block.id})`} />
          </svg>
        </div>

        {/* Favicon Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {!imageError ? (
            <img 
              src={faviconUrl} 
              alt=""
              className="w-16 h-16 rounded-lg shadow-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <Link2 className="w-16 h-16 text-white/50" />
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 glass-effect px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{block.category}</span>
        </div>

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full animate-pulse">
            <Sparkles className="h-3 w-3" />
            <span className="text-xs font-bold">NEW</span>
          </div>
        )}

        {/* Hover Icon */}
        {!isAdminMode && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-2">
              <ExternalLink className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gradient-animate transition-all">
          {block.title}
        </h3>
        
        {block.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {truncateText(block.description, 100)}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
            <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
              <Link2 className="h-2.5 w-2.5" />
            </div>
            <span className="truncate">{getDomainFromUrl(block.url)}</span>
          </div>

          {/* Visit count or other metrics */}
          <div className="text-xs text-gray-400 dark:text-gray-600">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              Click to visit →
            </span>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdminMode && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors interactive-scale"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors interactive-scale"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Hover Gradient Border Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-pink-400/20" />
      </div>
    </div>
  );
}