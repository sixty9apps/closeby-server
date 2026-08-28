const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { trim } = require('validator');

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: false,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    audio_url: {
      type: [String],
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    age_group: {
      type: [Number],
      required: true,
    },
    highlights: {
      type: [String],
      required: true,
      trim: true,
    },
    cover_image_url: {
      type: String,
      required: true,
      trim: true,
    },
    author_id: {
      type: String,
      required: false,
      trim: true,
    },
    // Lazy-cache of TTS audio keyed by narrator voice id. The client populates
    // an entry the first time a user generates audio for (book, voice); all
    // subsequent users get the cached Firebase URL instantly. See
    // setNarratorAudio() below for the write side.
    narrator_audio: {
      type: Map,
      of: String,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);
bookSchema.plugin(paginate);

bookSchema.statics.fetchAllBooks = async function (filter, options) {
  return this.paginate(filter, options);
};

bookSchema.statics.fetchBookById = async function (id) {
  return this.findById(id);
};

bookSchema.statics.saveBook = async function (bookData) {
  const book = new this(bookData);
  return book.save();
};

bookSchema.statics.updateBook = async function (bookId, updateBody) {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error(`Book not found with id ${bookId}`);
  }
  Object.assign(book, updateBody);
  await book.save();
  return book;
};

bookSchema.statics.deleteBook = async function (bookId) {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error(`Book not found with id ${bookId}`);
  }
  await book.deleteOne();
  return book;
};

bookSchema.statics.isBookTitleTaken = async function (title, excludeBookId) {
  const book = await this.findOne({ title, _id: { $ne: excludeBookId } });
  return !!book;
};

bookSchema.statics.fetchBooksByGenre = async function (genre, options = {}) {
  const filter = { genre, isActive: true };
  return this.paginate(filter, options);
};

bookSchema.statics.fetchBooksByAgeGroup = async function (ageGroup, options = {}) {
  const filter = { age_group: { $in: [ageGroup] }, isActive: true };
  return this.paginate(filter, options);
};

// Atomic "set if empty" for a single narrator entry. Two clients racing on the
// same (book, voice) will both upload to Firebase, but only the first PATCH
// wins; the second is a no-op so we never overwrite a good cached URL with a
// stale one. Returns the post-update book.
//
// `replaces` widens that by exactly one value: a client that has proven the
// stored URL no longer resolves passes back the URL it saw, making the write a
// compare-and-swap. Needed because Firebase mints a fresh download token on
// every overwrite, so re-uploading the audio does not revive the dead URL —
// the entry itself has to be rewritten. Scoping the overwrite to one known
// value means a client cannot clobber an entry someone else has already
// healed, nor replace an arbitrary working one.
bookSchema.statics.setNarratorAudio = async function (bookId, voiceId, audioUrl, replaces) {
  const field = `narrator_audio.${voiceId}`;
  const writable = [{ [field]: { $in: [null, ''] } }];
  if (replaces) {
    writable.push({ [field]: replaces });
  }
  await this.updateOne({ _id: bookId, $or: writable }, { $set: { [field]: audioUrl } });
  return this.findById(bookId);
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;