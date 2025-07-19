/**
 * Enhanced API routes for blocks management with logging and advanced features
 * GET /api/blocks - Fetch all blocks with filtering, pagination, and search
 * POST /api/blocks - Create new block with enhanced validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBlocks, createBlock, getBlocksCount, searchBlocks } from '@/lib/db-enhanced';
import { createBlockSchema, queryParamsSchema } from '@/lib/validations';
import { ApiResponse, BlocksResponse } from '@/lib/types';
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
 * GET /api/blocks
 * Fetch all blocks with optional filtering, pagination, and search
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    logger.info('GET', '/api/blocks', { category, search, limit, offset });

    // Validate query parameters
    const validatedParams = queryParamsSchema.safeParse({
      category: category || undefined,
      limit: limit || undefined,
      offset: offset || undefined
    });

    if (!validatedParams.success) {
      logger.error('GET', '/api/blocks', validatedParams.error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        message: validatedParams.error.errors[0]?.message || 'Invalid query parameters'
      }, {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: corsHeaders
      });
    }

    const { category: filterCategory, limit: queryLimit, offset: queryOffset } = validatedParams.data;
    const finalLimit = queryLimit || 50;
    const finalOffset = queryOffset || 0;

    let blocks;
    let total;

    // Handle search functionality
    if (search && search.trim().length > 0) {
      blocks = await searchBlocks(search.trim(), finalLimit);
      total = blocks.length; // For search, we return the actual results count
    } else {
      // Regular fetch with category filtering
      blocks = await getBlocks(filterCategory, finalLimit, finalOffset);
      total = await getBlocksCount(filterCategory);
    }

    const duration = Date.now() - startTime;

    const response: ApiResponse<BlocksResponse> = {
      success: true,
      data: {
        blocks,
        total,
        limit: finalLimit,
        offset: finalOffset,
        hasMore: finalOffset + blocks.length < total
      },
      message: search ? `Search completed in ${duration}ms` : SUCCESS_MESSAGES.BLOCKS_FETCHED
    };

    logger.info('GET', '/api/blocks', `Retrieved ${blocks.length}/${total} blocks in ${duration}ms`);

    return NextResponse.json(response, {
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`,
        'X-Total-Count': total.toString()
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('GET', '/api/blocks', error);

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      message: 'Failed to fetch blocks'
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
 * POST /api/blocks
 * Create a new block with enhanced validation and duplicate checking
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    logger.info('POST', '/api/blocks', body);

    // Validate request body
    const validatedData = createBlockSchema.safeParse(body);

    if (!validatedData.success) {
      logger.error('POST', '/api/blocks', validatedData.error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: ERROR_MESSAGES.VALIDATION_FAILED,
        message: validatedData.error.errors[0]?.message || 'Invalid input data'
      }, {
        status: HTTP_STATUS.BAD_REQUEST,
        headers: corsHeaders
      });
    }

    const newBlock = await createBlock(validatedData.data);
    const duration = Date.now() - startTime;

    const response: ApiResponse<typeof newBlock> = {
      success: true,
      data: newBlock,
      message: `${SUCCESS_MESSAGES.BLOCK_CREATED} in ${duration}ms`
    };

    logger.info('POST', '/api/blocks', `Created block ${newBlock.id} in ${duration}ms`);

    return NextResponse.json(response, {
      status: HTTP_STATUS.CREATED,
      headers: {
        ...corsHeaders,
        'X-Response-Time': `${duration}ms`,
        'Location': `/api/blocks/${newBlock.id}`
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('POST', '/api/blocks', error);

    // Handle specific error types
    let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let errorMessage: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.DUPLICATE_URL) {
        statusCode = HTTP_STATUS.CONFLICT;
        errorMessage = ERROR_MESSAGES.DUPLICATE_URL;
      } else if (error.message.includes('validation')) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorMessage = ERROR_MESSAGES.VALIDATION_FAILED;
      }
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: errorMessage,
      message: 'Failed to create block'
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
 * OPTIONS /api/blocks
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}