'use client'

import Link from 'next/link'
import Image from 'next/image'
import logoSrc from '@/public/HDlogo 1.png'

interface HeaderProps {
  showSearch?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function Header({ showSearch = true, searchQuery = '', onSearchChange }: HeaderProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is now handled by onChange, but we keep this for form submission
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logoSrc}
              alt="Logo"
              width={140}
              height={80}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search experiences"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[#EDEDED] rounded focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition-colors"
                  style={{ backgroundColor: '#FFD643' }}
                >
                  Search
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <Link href="/">
              <Image
                src={logoSrc}
                alt="Logo"
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search experiences"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#EDEDED] rounded focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition-colors text-sm"
                  style={{ backgroundColor: '#FFD643' }}
                >
                  Search
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </header>
  )
}