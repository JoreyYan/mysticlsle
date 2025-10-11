'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface FilterOption {
  labelKey: string
  value: string
  count?: number
}

interface FilterSection {
  titleKey: string
  sectionId: string
  options: FilterOption[]
}

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, string[]>) => void
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const { t } = useLanguage()
  const [expandedSections, setExpandedSections] = useState<string[]>(['color', 'type', 'size', 'stock'])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const filterSections: FilterSection[] = [
    {
      titleKey: 'color',
      sectionId: 'color',
      options: [
        { labelKey: 'black', value: 'black', count: 12 },
        { labelKey: 'pink', value: 'pink', count: 8 },
        { labelKey: 'purple', value: 'purple', count: 6 },
        { labelKey: 'blue', value: 'blue', count: 10 },
        { labelKey: 'green', value: 'green', count: 5 },
        { labelKey: 'white', value: 'white', count: 7 },
        { labelKey: 'silver', value: 'silver', count: 4 },
        { labelKey: 'gold', value: 'gold', count: 3 }
      ]
    },
    {
      titleKey: 'type',
      sectionId: 'type',
      options: [
        { labelKey: 'sets', value: 'sets', count: 15 },
        { labelKey: 'tops', value: 'tops', count: 20 },
        { labelKey: 'bottoms', value: 'bottoms', count: 18 },
        { labelKey: 'dresses', value: 'dresses', count: 10 },
        { labelKey: 'accessories', value: 'accessories', count: 12 },
        { labelKey: 'skirts', value: 'skirts', count: 8 }
      ]
    },
    {
      titleKey: 'size',
      sectionId: 'size',
      options: [
        { labelKey: 'XS', value: 'xs', count: 5 },
        { labelKey: 'S', value: 's', count: 18 },
        { labelKey: 'M', value: 'm', count: 22 },
        { labelKey: 'L', value: 'l', count: 15 },
        { labelKey: 'XL', value: 'xl', count: 8 },
        { labelKey: 'One Size', value: 'onesize', count: 10 }
      ]
    },
    {
      titleKey: 'stockStatus',
      sectionId: 'stock',
      options: [
        { labelKey: 'instock', value: 'instock', count: 45 },
        { labelKey: 'lowstock', value: 'lowstock', count: 8 },
        { labelKey: 'preorder', value: 'preorder', count: 3 }
      ]
    }
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    )
  }

  const toggleFilter = (sectionId: string, value: string) => {
    const currentFilters = selectedFilters[sectionId] || []

    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(v => v !== value)
      : [...currentFilters, value]

    const updatedFilters = {
      ...selectedFilters,
      [sectionId]: newFilters
    }

    setSelectedFilters(updatedFilters)
    onFilterChange?.(updatedFilters)
  }

  // Helper function to get translated label for filter option
  const getOptionLabel = (section: FilterSection, option: FilterOption): string => {
    // Size labels remain in English as they are language-neutral
    if (section.sectionId === 'size') {
      return option.labelKey
    }

    // For other sections, use translations
    if (section.sectionId === 'color') {
      return t.frontend.filters.colors[option.labelKey as keyof typeof t.frontend.filters.colors]
    } else if (section.sectionId === 'type') {
      return t.frontend.filters.types[option.labelKey as keyof typeof t.frontend.filters.types]
    } else if (section.sectionId === 'stock') {
      return t.frontend.filters.stock[option.labelKey as keyof typeof t.frontend.filters.stock]
    }

    return option.labelKey
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    onFilterChange?.({})
  }

  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0)

  return (
    <aside className="w-full lg:w-64 bg-white border-r min-h-screen">
      <div className="p-6 sticky top-20">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t.frontend.filters.title}</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {t.frontend.filters.clearAll}
            </button>
          )}
        </div>

        {/* Filter Sections */}
        <div className="space-y-4">
          {filterSections.map((section) => {
            const isExpanded = expandedSections.includes(section.sectionId)
            const selectedCount = selectedFilters[section.sectionId]?.length || 0
            const sectionTitle = t.frontend.filters[section.titleKey as keyof typeof t.frontend.filters] as string

            return (
              <div key={section.sectionId} className="border-b border-gray-200 pb-4">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.sectionId)}
                  className="flex items-center justify-between w-full py-2 text-left"
                >
                  <span className="font-medium text-gray-900">
                    {sectionTitle}
                    {selectedCount > 0 && (
                      <span className="ml-2 text-sm text-pink-600">({selectedCount})</span>
                    )}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>

                {/* Section Options */}
                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    {section.options.map((option) => {
                      const isSelected = selectedFilters[section.sectionId]?.includes(option.value) || false

                      return (
                        <label
                          key={option.value}
                          className="flex items-center space-x-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFilter(section.sectionId, option.value)}
                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {getOptionLabel(section, option)}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-500">({option.count})</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">{t.frontend.filters.activeFilters}:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedFilters).map(([sectionId, values]) =>
                values.map((value) => (
                  <span
                    key={`${sectionId}-${value}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full"
                  >
                    {value}
                    <button
                      onClick={() => toggleFilter(sectionId, value)}
                      className="hover:text-pink-900"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
