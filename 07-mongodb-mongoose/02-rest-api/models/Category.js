const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

// const transform = (doc, ret) => {
//   const { _id: id, __v, ...rest } = ret;
//   return { ...rest, id };
// };

// categorySchema.set('toJson', { transform });

// subCategorySchema.set('toJson', { transform });

module.exports = connection.model('Category', categorySchema);
