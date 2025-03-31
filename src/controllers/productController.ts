import HttpStatusCodes from "../constants/HttpStatusCodes";
import {  asyncHandler } from "../core";
import productService from "../services/productService";
import { AuthRequest } from "../middlewares/auth";
import ProductModel from "../models/Products";

const createProducts = asyncHandler(async(req:AuthRequest, res)=>{
    const data = await productService.createProduct(
      req.body,
      req.user!.user_id
    );
    res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: data,
        message: "Product created successfully.",
      });
})

const getAllUserProducts = asyncHandler(async(req :AuthRequest,res)=>{
    const data = await ProductModel.find({user : req.user!.user_id })
    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: data,
      message: "Products Retrieved Successfully",
    });
})

const getAllProducts = asyncHandler(async(req, res)=>{
    const data = await ProductModel.find()
    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: data,
      message: "Products Retrieved Successfully",
    });
})

const getAProduct = asyncHandler(async (req, res) => {
  const data = await ProductModel.findOne({_id: req.params.id});
  res.status(HttpStatusCodes.OK).json({
    success: true,
    data: data,
    message: "Products Retrieved Successfully",
  });
});

const updateAProduct = asyncHandler(async (req: AuthRequest, res) => {
  const data = await productService.updateAProduct(
    req.body,
    req.params.id,
    req.user!.user_id
  );
  res.status(HttpStatusCodes.OK).json({
    success: true,
    data: data,
    message: "Products Updated Successfully",
  });
});

const deleteAProduct = asyncHandler(async (req: AuthRequest, res) => {
  const data = await productService.deleteAProduct(
    req.params.id,
    req.user!.user_id
  );
  res.status(HttpStatusCodes.OK).json({
    success: true,
    data: data,
    message: "Products Deleted Successfully",
  });
});

export default {
  createProducts,
  getAllUserProducts,
  getAllProducts,
  getAProduct,
  updateAProduct,
  deleteAProduct,
};