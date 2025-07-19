/**
 * TypeScript interfaces for Smart Block Project
 */

export interface Block {
  id: number;
  title: string;
  description: string | null;
  url: string;
  color: string;
  category: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBlockRequest {
  title: string;
  description?: string;
  url: string;
  color: string;
  category: string;
}

export interface UpdateBlockRequest {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  category?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BlocksResponse {
  blocks: Block[];
  total: number;
  limit?: number;
  offset?: number;
  hasMore?: boolean;
}

export type Category = 
  | 'Technology'
  | 'E-Commerce'
  | 'Education'
  | 'Health & Fitness'
  | 'Finance'
  | 'Entertainment';

export type ColorOption = 
  | 'bg-red-500'
  | 'bg-blue-500'
  | 'bg-green-500'
  | 'bg-yellow-500'
  | 'bg-purple-500'
  | 'bg-orange-500'
  | 'bg-pink-500'
  | 'bg-indigo-500';