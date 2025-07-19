/**
 * BlockForm component - Form for creating and editing blocks
 * Handles form validation and submission
 */

'use client';

import { useState, useEffect } from 'react';
import { Block, CreateBlockRequest, UpdateBlockRequest } from '@/lib/types';
import { isValidUrl } from '@/lib/utils';
import { Save, X, Loader2 } from 'lucide-react';

interface BlockFormProps {
  block?: Block | null;
  onSubmit: (data: CreateBlockRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// Available options
const CATEGORIES = [
  'Technology',
  'E-Commerce',
  'Education',
  'Health & Fitness',
  'Finance',
  'Entertainment'
];

const COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500'
];

export default function BlockForm({ 
  block, 
  onSubmit, 
  onCancel, 
  loading = false 
}: BlockFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    color: 'bg-blue-500',
    category: 'Technology'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with block data if editing
  useEffect(() => {
    if (block) {
      setFormData({
        title: block.title,
        description: block.description || '',
        url: block.url,
        color: block.color,
        category: block.category
      });
    }
  }, [block]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Always send as CreateBlockRequest format - the modals will handle the conversion
      const submitData: CreateBlockRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        url: formData.url.trim(),
        color: formData.color,
        category: formData.category
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`
            w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
            ${errors.title ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Enter block title"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className={`
            w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none
            ${errors.description ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Enter block description (optional)"
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL *
        </label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          className={`
            w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
            ${errors.url ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="https://example.com"
          disabled={loading}
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
        )}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange('color', color)}
              className={`
                w-8 h-8 rounded-full ${color} border-2 transition-all
                ${formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'}
              `}
              disabled={loading}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={loading}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {block ? 'Update Block' : 'Create Block'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );
}