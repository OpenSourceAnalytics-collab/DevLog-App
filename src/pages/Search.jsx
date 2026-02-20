import { useState, useMemo } from 'react';
import { useLogs } from '@/context/LogContext.jsx';
import EntryCard from '@/components/EntryCard.jsx';
import { Search as SearchIcon } from 'lucide-react';
import { validateAndSanitizeText, MAX_LENGTHS } from '@/utils/validation.js';

export default function Search() {
  const { entries } = useLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchError, setSearchError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Date range filter
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

    if (start) {
      filtered = filtered.filter((entry) => entry.timestamp >= start);
    }
    if (end) {
      filtered = filtered.filter((entry) => entry.timestamp <= end);
    }

    // Full-text tokenized search across message, tags, and category
    const tokens = searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (tokens.length > 0) {
      filtered = filtered.filter((entry) => {
        const message = entry.message.toLowerCase();
        const category = entry.category?.toLowerCase() || '';
        const tags = entry.tags.map((t) => t.toLowerCase());

        return tokens.every((token) =>
          message.includes(token) ||
          category.includes(token) ||
          tags.some((tag) => tag.includes(token))
        );
      });
    }

    if (selectedTag) {
      const tag = selectedTag.toLowerCase();
      filtered = filtered.filter((entry) =>
        entry.tags.some((t) => t.toLowerCase() === tag)
      );
    }

    if (selectedCategory) {
      const category = selectedCategory.toLowerCase();
      filtered = filtered.filter(
        (entry) => entry.category?.toLowerCase() === category
      );
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [entries, searchQuery, selectedTag, selectedCategory, startDate, endDate]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  const allCategories = useMemo(() => {
    const categorySet = new Set();
    entries.forEach((entry) => {
      if (entry.category) {
        categorySet.add(entry.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [entries]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Search Entries
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search by keyword
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= MAX_LENGTHS.MESSAGE) {
                    if (!value.trim()) {
                      setSearchQuery(value);
                      setSearchError('');
                      return;
                    }
                    try {
                      validateAndSanitizeText(value, MAX_LENGTHS.MESSAGE);
                      setSearchQuery(value);
                      setSearchError('');
                    } catch (err) {
                      setSearchError(err instanceof Error ? err.message : 'Invalid search query');
                    }
                  }
                }}
                maxLength={MAX_LENGTHS.MESSAGE}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search entries..."
              />
              {searchError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{searchError}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All categories</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                max={endDate || undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min={startDate || undefined}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('');
                setSelectedCategory('');
                setStartDate('');
                setEndDate('');
                setSearchError('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
        </p>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400">No entries found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
