/**
 * Main Homepage - Smart Block Project Enhanced
 * Display blocks with advanced search and filtering
 */

'use client';

import Link from 'next/link';
import { useBlocks } from '@/hooks/useBlocks';
import BlockGrid from '@/components/blocks/BlockGrid';
import { Settings, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { blocks, loading, error } = useBlocks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">Smart Blocks</span>
            </div>
            
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Choose Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Domain
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover amazing websites, tools, and resources organized by category. 
              Click any block to explore new digital territories.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                {blocks.length} Curated Links
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                6 Categories
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Always Updated
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Block Grid with Enhanced Features */}
        <BlockGrid
          blocks={blocks}
          loading={loading}
          isAdminMode={false}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Smart Blocks. Curated with ❤️ for the digital explorer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}