export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  maxEntries: parseInt(process.env.MAX_ENTRIES || '10000', 10),
  maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || '10000', 10),
  maxTagLength: parseInt(process.env.MAX_TAG_LENGTH || '50', 10),
  maxCategoryLength: parseInt(process.env.MAX_CATEGORY_LENGTH || '100', 10),
  maxTagsPerEntry: parseInt(process.env.MAX_TAGS_PER_ENTRY || '20', 10),
};
