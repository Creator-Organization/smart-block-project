/**
 * Custom hook for block CRUD operations
 * Handles all block-related API calls and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { Block, CreateBlockRequest, UpdateBlockRequest, ApiResponse, BlocksResponse } from '@/lib/types';
import { formatApiError } from '@/lib/utils';

interface UseBlocksReturn {
  blocks: Block[];
  loading: boolean;
  error: string | null;
  totalBlocks: number;
  fetchBlocks: (category?: string) => Promise<void>;
  createBlock: (blockData: CreateBlockRequest) => Promise<Block | null>;
  updateBlock: (id: number, blockData: UpdateBlockRequest) => Promise<Block | null>;
  deleteBlock: (id: number) => Promise<boolean>;
  searchBlocks: (searchTerm: string) => Promise<void>;
  refreshBlocks: () => Promise<void>;
}

export function useBlocks(): UseBlocksReturn {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalBlocks, setTotalBlocks] = useState(0);

  /**
   * Fetch all blocks with optional category filter
   */
  const fetchBlocks = useCallback(async (category?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await fetch(`/api/blocks?${params}`);
      const data: ApiResponse<BlocksResponse> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blocks');
      }

      if (data.success && data.data) {
        setBlocks(data.data.blocks);
        setTotalBlocks(data.data.total);
      }
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Error fetching blocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new block
   */
  const createBlock = useCallback(async (blockData: CreateBlockRequest): Promise<Block | null> => {
    setError(null);

    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
      });

      const data: ApiResponse<Block> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create block');
      }

      if (data.success && data.data) {
        setBlocks(prev => [data.data!, ...prev]);
        setTotalBlocks(prev => prev + 1);
        return data.data;
      }

      return null;
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Error creating block:', err);
      return null;
    }
  }, []);

  /**
   * Update an existing block
   */
  const updateBlock = useCallback(async (id: number, blockData: UpdateBlockRequest): Promise<Block | null> => {
    setError(null);

    try {
      const response = await fetch(`/api/blocks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
      });

      const data: ApiResponse<Block> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update block');
      }

      if (data.success && data.data) {
        setBlocks(prev => 
          prev.map(block => block.id === id ? data.data! : block)
        );
        return data.data;
      }

      return null;
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Error updating block:', err);
      return null;
    }
  }, []);

  /**
   * Delete a block
   */
  const deleteBlock = useCallback(async (id: number): Promise<boolean> => {
    setError(null);

    try {
      const response = await fetch(`/api/blocks/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<null> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete block');
      }

      if (data.success) {
        setBlocks(prev => prev.filter(block => block.id !== id));
        setTotalBlocks(prev => prev - 1);
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Error deleting block:', err);
      return false;
    }
  }, []);

  /**
   * Search blocks
   */
  const searchBlocks = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/blocks?${params}`);
      const data: ApiResponse<BlocksResponse> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search blocks');
      }

      if (data.success && data.data) {
        setBlocks(data.data.blocks);
        setTotalBlocks(data.data.total);
      }
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Error searching blocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh blocks (re-fetch current data)
   */
  const refreshBlocks = useCallback(async () => {
    await fetchBlocks();
  }, [fetchBlocks]);

  // Initial fetch on mount
  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  return {
    blocks,
    loading,
    error,
    totalBlocks,
    fetchBlocks,
    createBlock,
    updateBlock,
    deleteBlock,
    searchBlocks,
    refreshBlocks,
  };
}