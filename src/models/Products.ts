import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
export default ProductModel;
