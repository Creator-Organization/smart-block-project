/**
 * API routes for blocks management
 * GET /api/blocks - Fetch all blocks
 * POST /api/blocks - Create new block
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBlocks, createBlock } from '@/lib/db';
import { createBlockSchema, queryParamsSchema } from '@/lib/validations';
import { ApiResponse, BlocksResponse } from '@/lib/types';

/**
 * GET /api/blocks
 * Fetch all blocks with optional category filter
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Validate query parameters
    const validatedParams = queryParamsSchema.safeParse({
      category: category || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined
    });
    
    if (!validatedParams.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid query parameters',
        message: validatedParams.error.errors[0]?.message || 'Validation failed'
      }, { status: 400 });
    }
    
    const blocks = await getBlocks(validatedParams.data.category);
    
    const response: ApiResponse<BlocksResponse> = {
      success: true,
      data: {
        blocks,
        total: blocks.length
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('GET /api/blocks error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch blocks'
    }, { status: 500 });
  }
}

/**
 * POST /api/blocks
 * Create a new block
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createBlockSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Validation failed',
        message: validatedData.error.errors[0]?.message || 'Invalid input data'
      }, { status: 400 });
    }
    
    const newBlock = await createBlock(validatedData.data);
    
    const response: ApiResponse<typeof newBlock> = {
      success: true,
      data: newBlock,
      message: 'Block created successfully'
    };
    
    return NextResponse.json(response, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/blocks error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create block'
    }, { status: 500 });
  }
}