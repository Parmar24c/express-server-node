import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category collection
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// 🛠️ Add partial index:
productSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

const Product = mongoose.model('Product', productSchema);
export default Product;
