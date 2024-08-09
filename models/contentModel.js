const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Oops! You forgot the title. It's like a book with no cover!"],
  },
  category: {
    type: String,
    required: [true, "No category? How will people know what they're getting into?"],
  },
  thumbnailUrl: {
    type: String,
    required: [true, "A thumbnail is worth a thousand words... don't skip it!"],
  },
  type: {
    type: String,
    enum: ['text', 'video', 'podcast'],
    required: [true, "Is it a text, video, or podcast? The world needs to know!"],
  },
  readerStat: {
    type: Number,
  },
  readingStat: {
    type: Number,
  },
  author: {
    type: String,
    required: [true, "Who's the genius behind this? Author name, please!"],
  },
  publicationDate: {
    type: Date,
    required: [true, "Time-travel is cool, but we still need a publication date!"],
  },
});

module.exports = mongoose.model('Content', contentSchema);
