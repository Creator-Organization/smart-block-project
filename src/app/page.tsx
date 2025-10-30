'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBlocks } from '@/hooks/useBlocks';
import { useTheme } from '@/components/ui/ThemeProvider';
import BlockGrid from '@/components/blocks/BlockGrid';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { Sparkles, Building2 } from 'lucide-react';

export default function HomePage() {
  const { blocks, loading, error } = useBlocks();
  const { theme, isDarkMode } = useTheme();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-700" style={{
      background: hoveredColor 
        ? `linear-gradient(to bottom right, ${hoveredColor}08, ${hoveredColor}15, ${hoveredColor}08)`
        : isDarkMode 
          ? 'linear-gradient(to bottom right, #111827, #0f172a, #000000)'
          : 'linear-gradient(to bottom right, #f9fafb, #e5e7eb, #d1d5db)'
    }}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Theme Toggle Button */}
      <ThemeToggleButton />

      {/* Header */}
      <header className="relative z-10 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company Name - Centered and Prominent */}
          <div className="flex justify-center items-center mb-20">
            <div className="flex items-center space-x-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-8 py-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <Building2 className="h-10 w-10" style={{ color: theme.accent }} />
              <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Creator Research Pvt. Ltd.
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 mb-10 px-6 py-3 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 shadow-md">
              <Sparkles className="h-5 w-5" style={{ color: theme.accent }} />
              <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Explore Our Digital Ecosystem
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="text-gray-900 dark:text-white block mb-3">
                Welcome to
              </span>
              <span 
                className="block transition-all duration-700 font-black"
                style={{
                  color: hoveredColor || theme.accent,
                  textShadow: hoveredColor ? `0 0 40px ${hoveredColor}40` : 'none'
                }}
              >
                Our Domains
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto font-medium">
              Discover our suite of digital solutions and services. Each domain represents a unique aspect of our commitment to innovation.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Error State */}
        {error && (
          <div className="mb-10 p-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-3xl backdrop-blur-sm shadow-lg">
            <p className="text-red-800 dark:text-red-300 text-center font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Block Grid */}
        <BlockGrid
          blocks={blocks}
          loading={loading}
          isAdminMode={false}
          onCardHover={setHoveredColor}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-gray-300 dark:border-gray-700 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-base font-medium text-gray-600 dark:text-gray-400">
            © 2025 Creator Research Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}