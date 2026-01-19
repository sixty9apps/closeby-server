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

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;