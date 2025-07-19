/**
 * BlockCard component - Individual block display
 * Shows block information with hover effects and actions
 */

'use client';

import { Block } from '@/lib/types';
import { getDomainFromUrl, truncateText } from '@/lib/utils';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

interface BlockCardProps {
  block: Block;
  isAdminMode?: boolean;
  onEdit?: (block: Block) => void;
  onDelete?: (id: number) => void;
}

export default function BlockCard({ 
  block, 
  isAdminMode = false, 
  onEdit, 
  onDelete 
}: BlockCardProps) {
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

  return (
    <div
      className={`
        group relative bg-white rounded-lg shadow-md hover:shadow-lg 
        transition-all duration-300 transform hover:-translate-y-1
        border border-gray-200 overflow-hidden
        ${!isAdminMode ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={handleCardClick}
    >
      {/* Color Bar */}
      <div 
        className={`h-2 w-full ${block.color}`}
      />

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {truncateText(block.title, 50)}
          </h3>
          
          {!isAdminMode && (
            <ExternalLink 
              className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
            />
          )}
        </div>

        {/* Description */}
        {block.description && (
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {truncateText(block.description, 120)}
          </p>
        )}

        {/* URL Domain */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {getDomainFromUrl(block.url)}
          </span>

          {/* Category */}
          <span className="text-xs text-gray-500 font-medium">
            {block.category}
          </span>
        </div>
      </div>

      {/* Admin Actions */}
      {isAdminMode && (
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
            title="Edit block"
          >
            <Edit className="h-3 w-3" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Delete block"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
    </div>
  );
}