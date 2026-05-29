#!/usr/bin/env node
/**
 * Seed an author + their original books into the closeby-server database.
 *
 * Usage:
 *   node scripts/seed-author.js scripts/seed-dr-eli.json
 *
 * Idempotent:
 *   - Author is matched by `name`. Existing → reuse; missing → create.
 *   - Books are matched by (`title`, `author_id`). Existing → skip; missing → create.
 *
 * Required env (loaded from .env via src/config/config.js):
 *   NODE_ENV, MONGODB_URL, API_KEY
 *
 * Designed for the "Original Stories by author" feature:
 *   - Books are created with `audio_url: []`. TTS audio is generated on
 *     first play by the iOS client and cached in `book.narrator_audio`
 *     via PATCH /v1/book/:id/narrator-audio.
 *   - The server filters books with `author_id` out of the default
 *     GET /v1/book response so live 2.1 clients never see these books
 *     until they ship the new client that knows how to handle them.
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const config = require('../src/config/config');
const { Book, AuthorBook } = require('../src/models');

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node scripts/seed-author.js <path-to-seed.json>');
    process.exit(1);
  }

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`Seed file not found: ${absPath}`);
    process.exit(1);
  }

  const seed = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
  if (!seed.author || !Array.isArray(seed.books)) {
    console.error('Seed file must have { author, books: [...] }');
    process.exit(1);
  }

  console.log(`▸ Connecting to MongoDB (${config.env})`);
  await mongoose.connect(config.mongoose.url, config.mongoose.options);

  try {
    const authorName = seed.author.name;
    console.log(`▸ Upserting author: ${authorName}`);
    let author = await AuthorBook.findOne({ name: authorName });
    if (author) {
      console.log(`  → already exists: ${author._id}`);
    } else {
      author = await AuthorBook.create(seed.author);
      console.log(`  ✓ created: ${author._id}`);
    }

    const authorId = author._id.toString();
    const createdBookIds = [];
    let createdCount = 0;
    let skippedCount = 0;

    for (const book of seed.books) {
      const existing = await Book.findOne({ title: book.title, author_id: authorId });
      if (existing) {
        console.log(`  ◦ skip "${book.title}" (already exists: ${existing._id})`);
        createdBookIds.push(existing._id.toString());
        skippedCount += 1;
        continue;
      }
      const created = await Book.create({ ...book, author_id: authorId });
      console.log(`  ✓ create "${book.title}" → ${created._id}`);
      createdBookIds.push(created._id.toString());
      createdCount += 1;
    }

    // Keep author.book_ids in sync with the books we just touched.
    const merged = Array.from(new Set([...(author.book_ids || []), ...createdBookIds]));
    if (merged.length !== (author.book_ids || []).length) {
      author.book_ids = merged;
      await author.save();
      console.log(`▸ Updated author.book_ids (now ${merged.length})`);
    }

    console.log('\n═══ Summary ═══');
    console.log(`  author:  ${authorName} (${authorId})`);
    console.log(`  books:   ${createdCount} created, ${skippedCount} already existed`);
    console.log('  audio:   audio_url left empty; populates lazily on first play (narrator_audio cache)');
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});
