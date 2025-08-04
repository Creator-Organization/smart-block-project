/**
 * Main Homepage - Smart Block Project with Theme Support
 * Includes theme selector and dynamic colors
 */

'use client';

import Link from 'next/link';
import { useBlocks } from '@/hooks/useBlocks';
import { useTheme } from '@/components/ui/ThemeProvider';
import BlockGrid from '@/components/blocks/BlockGrid';
import FloatingBackground from '@/components/ui/FloatingBackground';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';
import { Sparkles, Github, Twitter, Globe } from 'lucide-react';

export default function HomePage() {
  const { blocks, loading, error } = useBlocks();
  const { theme, isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? theme.gradientDark : theme.gradient} relative overflow-hidden`}>
      {/* Floating Background Elements */}
      <FloatingBackground />

      {/* Theme Toggle Button */}
      <ThemeToggleButton />

      {/* Header */}
      <header className="relative z-10">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-enhanced opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top Bar with Theme Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              {/* Social Links */}
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex justify-center items-center mb-12">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Sparkles className="h-8 w-8 animate-pulse" style={{ color: theme.accent }} />
                <div className="absolute inset-0 blur-lg opacity-50" style={{ backgroundColor: theme.accent }}></div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Smart Blocks</span>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-12 relative z-20">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
              <div className="mb-4">Choose Your</div>
              <div style={{ color: theme.accent }}>
                Domain
              </div>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6 mb-8">
              Discover amazing websites, tools, and resources organized by category. 
              Click any block to explore new digital territories.
            </p>
            
            {/* Animated Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center glass-effect px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 rounded-full mr-2 pulse-new" style={{ backgroundColor: theme.accent }} />
                <span className="text-gray-700 dark:text-gray-300">{blocks.length} Curated Links</span>
              </div>
              <div className="flex items-center glass-effect px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                <span className="text-gray-700 dark:text-gray-300">6 Categories</span>
              </div>
              <div className="flex items-center glass-effect px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Always Updated</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg glass-effect">
            <p className="text-red-800 dark:text-red-300 text-center">{error}</p>
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
      <footer className="relative bg-gray-900 dark:bg-black text-white py-12 mt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6" style={{ color: theme.accent }} />
                <span className="text-xl font-bold">Smart Blocks</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your curated collection of the best resources on the web.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get notified about new resources and updates.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-l-lg focus:outline-none transition-colors text-white placeholder-gray-500"
                  style={{ borderColor: theme.accent }}
                />
                <button 
                  className="px-4 py-2 rounded-r-lg transition-colors interactive-scale text-gray-900 font-medium"
                  style={{ backgroundColor: theme.accent }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Smart Blocks. Crafted with ❤️ for the digital explorer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}