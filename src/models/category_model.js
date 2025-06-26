import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// 🛠️ Add partial index:
categorySchema.index({ name: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

const Category = mongoose.model('Category', categorySchema);
export default Category;
