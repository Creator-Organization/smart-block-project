/**
 * API routes for individual block management
 * PUT /api/blocks/[id] - Update block
 * DELETE /api/blocks/[id] - Delete block
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBlockById, updateBlock, deleteBlock } from '@/lib/db';
import { updateBlockSchema } from '@/lib/validations';
import { ApiResponse } from '@/lib/types';

/**
 * PUT /api/blocks/[id]
 * Update an existing block
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid block ID',
        message: 'Block ID must be a number'
      }, { status: 400 });
    }
    
    // Check if block exists
    const existingBlock = await getBlockById(id);
    if (!existingBlock) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Block not found',
        message: `Block with ID ${id} does not exist`
      }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateBlockSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Validation failed',
        message: validatedData.error.errors[0]?.message || 'Invalid input data'
      }, { status: 400 });
    }
    
    const updatedBlock = await updateBlock(id, validatedData.data);
    
    if (!updatedBlock) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Update failed',
        message: 'Failed to update block'
      }, { status: 500 });
    }
    
    const response: ApiResponse<typeof updatedBlock> = {
      success: true,
      data: updatedBlock,
      message: 'Block updated successfully'
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('PUT /api/blocks/[id] error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update block'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/blocks/[id]
 * Delete a block
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid block ID',
        message: 'Block ID must be a number'
      }, { status: 400 });
    }
    
    // Check if block exists
    const existingBlock = await getBlockById(id);
    if (!existingBlock) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Block not found',
        message: `Block with ID ${id} does not exist`
      }, { status: 404 });
    }
    
    const deleted = await deleteBlock(id);
    
    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Delete failed',
        message: 'Failed to delete block'
      }, { status: 500 });
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Block deleted successfully'
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('DELETE /api/blocks/[id] error:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete block'
    }, { status: 500 });
  }
}
