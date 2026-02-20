import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogs } from '@/context/LogContext.jsx';
import { validateAndSanitizeText, validateAndSanitizeTag, validateAndSanitizeCategory, validateTags, MAX_LENGTHS } from '@/utils/validation.js';
import { rateLimiter } from '@/utils/security.js';

export default function EntryForm() {
  const navigate = useNavigate();
  const { addEntry } = useLogs();
  const [formData, setFormData] = useState({
    message: '',
    tags: [],
    category: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Rate limiting check (client-side UX)
      if (!rateLimiter.check('add-entry')) {
        setError('Too many requests. Please wait a moment before adding another entry.');
        setIsSubmitting(false);
        return;
      }

      // Validate and sanitize input
      const validatedMessage = validateAndSanitizeText(formData.message.trim());
      const validatedTags = validateTags(formData.tags);
      const validatedCategory = formData.category 
        ? validateAndSanitizeCategory(formData.category.trim())
        : undefined;

      await addEntry({
        message: validatedMessage,
        tags: validatedTags,
        category: validatedCategory,
      });

      setFormData({ message: '', tags: [], category: '' });
      setTagInput('');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    try {
      const validatedTag = validateAndSanitizeTag(tagInput.trim());
      if (!formData.tags.includes(validatedTag)) {
        if (formData.tags.length >= MAX_LENGTHS.MAX_TAGS) {
          setError(`Maximum ${MAX_LENGTHS.MAX_TAGS} tags allowed`);
          return;
        }
        setFormData({ ...formData, tags: [...formData.tags, validatedTag] });
        setTagInput('');
        setError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid tag');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Add New Entry
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Message * ({formData.message.length}/{MAX_LENGTHS.MESSAGE})
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTHS.MESSAGE) {
                setFormData({ ...formData, message: e.target.value });
                setError('');
              }
            }}
            maxLength={MAX_LENGTHS.MESSAGE}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="What did you work on today?"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="e.g., work, personal, learning"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
