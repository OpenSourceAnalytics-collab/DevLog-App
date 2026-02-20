import { format } from 'date-fns';
import { Tag, X } from 'lucide-react';
import { validateEntryId } from '@/utils/validation.js';

export default function EntryCard({ entry, onDelete }) {
  const handleDelete = () => {
    if (onDelete) {
      try {
        // Validate ID before deletion
        const validatedId = validateEntryId(entry.id);
        onDelete(validatedId);
      } catch (error) {
        console.error('Invalid entry ID:', error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <time className="text-sm text-gray-500 dark:text-gray-400">
          {format(entry.timestamp, 'PPpp')}
        </time>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete entry"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* React automatically escapes content, but we ensure it's safe */}
      <p className="text-gray-900 dark:text-gray-100 mb-4 whitespace-pre-wrap break-words">{entry.message}</p>
      
      <div className="flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
        {entry.category && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {entry.category}
          </span>
        )}
      </div>
    </div>
  );
}
