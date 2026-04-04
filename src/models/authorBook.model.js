const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const authorBookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    book_ids: {
      type: [String],
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
authorBookSchema.plugin(toJSON);
authorBookSchema.plugin(paginate);

authorBookSchema.statics.fetchAllAuthorBooks = async function (filter, options) {
  return this.paginate(filter, options);
};

authorBookSchema.statics.fetchAuthorBookById = async function (id) {
  return this.findById(id);
};

authorBookSchema.statics.saveAuthorBook = async function (authorBookData) {
  const authorBook = new this(authorBookData);
  return authorBook.save();
};

authorBookSchema.statics.isAuthorNameTaken = async function (name, excludeAuthorBookId) {
  const authorBook = await this.findOne({ name, _id: { $ne: excludeAuthorBookId } });
  return !!authorBook;
};

const AuthorBook = mongoose.model('AuthorBook', authorBookSchema);

module.exports = AuthorBook;
