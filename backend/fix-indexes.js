import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('snippets');

    console.log('\nDropping old text indexes...');
    try {
      await collection.dropIndex('title_text_description_text');
      console.log('✓ Dropped old text index');
    } catch (err) {
      console.log('No old text index to drop (this is fine)');
    }

    console.log('\nCreating new text index with default_language: none and custom language_override...');
    await collection.createIndex(
      { title: 'text', description: 'text' },
      {
        default_language: 'none',
        // Use a non-existent field so MongoDB never treats the document
        // `language` field as a natural-language override.
        language_override: '__ignored_text_language',
      }
    );
    console.log('✓ New text index created');

    console.log('\n✅ Indexes fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixIndexes();
