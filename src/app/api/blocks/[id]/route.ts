/**
 * Enhanced API routes for individual block management with comprehensive logging
 * GET /api/blocks/[id] - Get single block
 * PUT /api/blocks/[id] - Update block with optimistic locking
 * DELETE /api/blocks/[id] - Delete block with confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBlockById, updateBlock, deleteBlock } from '@/lib/db-enhanced';
import { updateBlockSchema } from '@/lib/validations';
import { ApiResponse } from '@/lib/types';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Request logger utility
 */
const logger = {
  info: (method: string, path: string, data?: any) => {
    console.log(`[API ${method}] ${path}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (method: string, path: string, error: any) => {
    console.error(`[API ERROR ${method}] ${path}:`, error);
  }
};

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Validate and parse block ID from URL params
 */
function validateBlockId(idParam: string): { isValid: boolean; id?: number; error?: string } {
  const id = parseInt(idParam);

  if (isNaN(id) || id <= 0) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_BLOCK_ID
    };
  }

  return { isValid: true, id };
}

/**
 * GET /api/blocks/[id]
 * Get a single block by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    logger.info('GET', `/api/blocks/${params.id}`);

    const { isValid, id, error } = validateBlockId(params.id);

    if (!isValid) {
      logger.error('GET', `/api/blocks/${params.id}`, error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.INVALID_BLOCK_ID,
        message: error || 'Invalid block ID'
      }, {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: corsHeaders
      });
    }

    const block = await getBlockById(id!);
    const duration = Date.now() - startTime;

    if (!block) {
      logger.info('GET', `/api/blocks/${params.id}`, 'Block not found');
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.BLOCK_NOT_FOUND,
        message: `Block with ID ${id} does not exist`
      }, {
        status: HTTP_STATUS.NOT_FOUND,
        headers: {
          ...corsHeaders,
          'X-Response-Time': `${duration}ms`
        }
      });
    }

    const response: ApiResponse<typeof block> = {
      success: true,
      data: block,
      message: `Block retrieved successfully in ${duration}ms`
    };

    logger.info('GET', `/api/blocks/${params.id}`, `Block found in ${duration}ms`);

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`,
        'Cache-Control': 'public, max-age=60',
        'ETag': `"${block.id}-${new Date(block.updated_at).getTime()}"`
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('GET', `/api/blocks/${params.id}`, error);

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      message: 'Failed to fetch block'
    }, {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`
      }
    });
  }
}

/**
 * PUT /api/blocks/[id]
 * Update an existing block with optimistic locking
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    logger.info('PUT', `/api/blocks/${params.id}`, body);

    const { isValid, id, error } = validateBlockId(params.id);

    if (!isValid) {
      logger.error('PUT', `/api/blocks/${params.id}`, error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.INVALID_BLOCK_ID,
        message: error || 'Invalid block ID'
      }, {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: corsHeaders
      });
    }

    // Validate request body
    const validatedData = updateBlockSchema.safeParse(body);

    if (!validatedData.success) {
      logger.error('PUT', `/api/blocks/${params.id}`, validatedData.error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        message: validatedData.error.errors[0]?.message || 'Invalid input data'
      }, {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: corsHeaders
      });
    }

    // Check if there are any fields to update
    const updateFields = Object.keys(validatedData.data).filter(
      key => validatedData.data[key as keyof typeof validatedData.data] !== undefined
    );

    if (updateFields.length === 0) {
      logger.info('PUT', `/api/blocks/${params.id}`, 'No fields to update');
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        message: 'No fields provided for update'
      }, {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: corsHeaders
      });
    }

    const updatedBlock = await updateBlock(id!, validatedData.data);
    const duration = Date.now() - startTime;

    if (!updatedBlock) {
      logger.error('PUT', `/api/blocks/${params.id}`, 'Update operation failed');
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.BLOCK_NOT_FOUND,
        message: 'Block not found or update failed'
      }, {
        status: HTTP_STATUS.NOT_FOUND,
        headers: {
          ...corsHeaders,
          'X-Response-Time': `${duration}ms`
        }
      });
    }

    const response: ApiResponse<typeof updatedBlock> = {
      success: true,
      data: updatedBlock,
      message: `${SUCCESS_MESSAGES.BLOCK_UPDATED} in ${duration}ms`
    };

    logger.info('PUT', `/api/blocks/${params.id}`, `Updated successfully in ${duration}ms`);

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`,
        'X-Updated-Fields': updateFields.join(', ')
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('PUT', `/api/blocks/${params.id}`, error);

    // Handle specific error types
    // Handle specific error types
    let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let errorMessage: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.BLOCK_NOT_FOUND) {
        statusCode = HTTP_STATUS.NOT_FOUND;
        errorMessage = ERROR_MESSAGES.BLOCK_NOT_FOUND;
      } else if (error.message === ERROR_MESSAGES.DUPLICATE_URL) {
        statusCode = HTTP_STATUS.CONFLICT;
        errorMessage = ERROR_MESSAGES.DUPLICATE_URL;
      }
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: errorMessage,
      message: 'Failed to update block'
    }, {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`
      }
    });
  }
}

/**
 * DELETE /api/blocks/[id]
 * Delete a block with confirmation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    logger.info('DELETE', `/api/blocks/${params.id}`);

    const { isValid, id, error } = validateBlockId(params.id);

    if (!isValid) {
      logger.error('DELETE', `/api/blocks/${params.id}`, error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.INVALID_BLOCK_ID,
        message: error || 'Invalid block ID'
      }, {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: corsHeaders
      });
    }

    const deleted = await deleteBlock(id!);
    const duration = Date.now() - startTime;

    if (!deleted) {
      logger.error('DELETE', `/api/blocks/${params.id}`, 'Delete operation failed');
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.BLOCK_NOT_FOUND,
        message: 'Block not found or delete failed'
      }, {
        status: HTTP_STATUS.NOT_FOUND,
        headers: {
          ...corsHeaders,
          'X-Response-Time': `${duration}ms`
        }
      });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: `${SUCCESS_MESSAGES.BLOCK_DELETED} in ${duration}ms`
    };

    logger.info('DELETE', `/api/blocks/${params.id}`, `Deleted successfully in ${duration}ms`);

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('DELETE', `/api/blocks/${params.id}`, error);

    // Handle specific error types
    let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let errorMessage: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (error instanceof Error && error.message === ERROR_MESSAGES.BLOCK_NOT_FOUND) {
      statusCode = HTTP_STATUS.NOT_FOUND;
      errorMessage = ERROR_MESSAGES.BLOCK_NOT_FOUND;
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: errorMessage,
      message: 'Failed to delete block'
    }, {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`
      }
    });
  }
}

/**
 * OPTIONS /api/blocks/[id]
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}