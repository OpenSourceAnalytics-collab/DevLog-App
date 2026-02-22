import { useLogs } from '@/context/LogContext.jsx';
import { api } from '@/utils/api.js';
import { BarChart3, FileText, Tag, Folder } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Stats() {
  const { entries } = useLogs();
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalTags: 0,
    totalCategories: 0,
    mostUsedTags: [],
    mostUsedCategories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Failed to load statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [entries]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  const avgPerDay = stats.totalEntries > 0 && entries.length > 0
    ? (stats.totalEntries / Math.max(1, Math.ceil((Date.now() - Math.min(...entries.map(e => e.timestamp.getTime()))) / (1000 * 60 * 60 * 24)))).toFixed(1)
    : '0';

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Statistics
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Entries
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.totalEntries}
              </p>
            </div>
            <FileText className="w-12 h-12 text-primary-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tags
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.totalTags}
              </p>
            </div>
            <Tag className="w-12 h-12 text-primary-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {stats.totalCategories}
              </p>
            </div>
            <Folder className="w-12 h-12 text-primary-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg per Day
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {avgPerDay}
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-primary-500" />
          </div>
        </div>
      </div>

      {stats.mostUsedTags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Most Used Tags
          </h3>
          <div className="space-y-2">
            {stats.mostUsedTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{tag}</span>
                <span className="text-primary-600 dark:text-primary-400 font-medium">
                  {count} {count === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.mostUsedCategories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Most Used Categories
          </h3>
          <div className="space-y-2">
            {stats.mostUsedCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{category}</span>
                <span className="text-primary-600 dark:text-primary-400 font-medium">
                  {count} {count === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
