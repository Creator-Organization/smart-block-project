/**
 * Main Homepage - Smart Block Project Final Polished Version
 * With improved colors and fixed search bar
 */

'use client';

import Link from 'next/link';
import { useBlocks } from '@/hooks/useBlocks';
import BlockGrid from '@/components/blocks/BlockGrid';
import FloatingBackground from '@/components/ui/FloatingBackground';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Settings, Sparkles, Github, Twitter, Globe } from 'lucide-react';

export default function HomePage() {
  const { blocks, loading, error } = useBlocks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingBackground />

      {/* Header */}
      <header className="relative">
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
          <nav className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                <div className="absolute inset-0 blur-lg bg-amber-500 opacity-50"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Smart Blocks</span>
            </div>
            
            <Link
              href="/admin"
              className="btn-3d flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-md interactive-scale"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-12 relative">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 relative">
              <span className="relative inline-block">
                Choose Your
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10">
                  <path
                    d="M0,5 Q50,0 100,5 T200,5"
                    stroke="url(#underline-gradient)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-gradient-animate mt-2">
                Domain
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Discover amazing websites, tools, and resources organized by category. 
              Click any block to explore new digital territories.
            </p>
            
            {/* Animated Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center glass-effect px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 pulse-new" />
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
                <Sparkles className="h-6 w-6 text-amber-400" />
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
                  className="flex-1 px-4 py-2 bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-l-lg focus:outline-none focus:border-amber-500 transition-colors text-white placeholder-gray-500"
                />
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-r-lg transition-colors interactive-scale text-gray-900 font-medium">
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