import HttpStatusCodes from "../constants/HttpStatusCodes";
import ProductModel from "../models/Products";
import UserModel from "../models/User";
import { ProductType } from "../types/product";
import ApiError from "../utils/ApiError";
import { generateVerificationOTP } from "../utils/otp";


const createProduct = async (data: ProductType, id:string)  => {
   const findProduct = await ProductModel.findOne({name: data.name})
   if(findProduct){
    throw new ApiError(HttpStatusCodes.BAD_REQUEST,"Product with the given name already exist")
   }
   const product = await ProductModel.create({...data, user:id})
   return product
};

const updateAProduct = async (
  data: ProductType,
  id: string,
  userId: string
) => {
  // Check if the product exists
  const findProduct = await ProductModel.findOne({ _id: id, user: userId });

  if (!findProduct) {
    throw new ApiError(HttpStatusCodes.NOT_FOUND, "This product doesn't exist");
  }

  const updatedProduct = await ProductModel.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: data },
    { new: true } 
  );

  return updatedProduct;
};
const getProductById = async (id: string) => {
  const product = await ProductModel.findOne({ _id: id });

  if (!product) {
    throw new ApiError(HttpStatusCodes.NOT_FOUND, "Product not found");
  }

  return product;
};

const deleteAProduct = async (id: string, userId: string) => {

  const deletedProduct = await ProductModel.findOneAndDelete({
    _id: id,
    user: userId,
  });
  

  if (!deletedProduct) {
    throw new ApiError(HttpStatusCodes.NOT_FOUND, "This product doesn't exist ");
  }

  return 
};

export default {
  createProduct,
  updateAProduct,
  deleteAProduct,
  getProductById,
};