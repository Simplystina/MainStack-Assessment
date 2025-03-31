import request from "supertest";
import app from "../src/server"; // Assuming your Express app is exported from here
import ProductModel from "../src/models/Products";
import productService from "../src/services/productService";
import HttpStatusCodes from "../src/constants/HttpStatusCodes";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { reqAddProduct, reqGetAProduct, reqGetProducts } from "../src/utils/data/product.test.data";
import dotenv from "dotenv"
import ApiError from "../src/utils/ApiError";
dotenv.config()


//jest.mock("../models/Products");
// Mock the ProductModel and productService
jest.mock("../src/models/Products");
jest.mock("../src/services/productService");

describe("Product API Endpoints", () => {
  let token: string;
  const userId = "67e6c72b501df5f23aa676d6";
  const productId = "507f1f77bcf86cd799439011";
  let email = "john.doe@example.com";
  let secret = process.env.JWT_SECRET!;

  beforeAll(() => {
    token = jwt.sign(
      { user_id: userId, email: email },
      secret,
      {
        expiresIn: "1h",
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /products", () => {
    it("should create a product", async () => {
        (productService.createProduct as jest.Mock).mockResolvedValue(
          reqAddProduct
        );
      const res = await request(app)
        .post("/v1/product")
        .set("Authorization", `Bearer ${token}`)
        .send(reqAddProduct);

      expect(res.status).toBe(HttpStatusCodes.CREATED);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(reqAddProduct);
      expect(productService.createProduct).toHaveBeenCalledWith(
        reqAddProduct,
        userId
      );
    });
  });
    describe("GET /v1/product", () => {
    it("should get all products for the authenticated user", async () => {
        (ProductModel.find as jest.Mock).mockResolvedValue(reqGetProducts);

        const res = await request(app)
        .get("/v1/product")
        .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(reqGetProducts);
        expect(ProductModel.find).toHaveBeenCalledWith({ user: userId });
    });
    });

    describe("GET /v1/product/all", () => {
    it("should get all products", async () => {
        (ProductModel.find as jest.Mock).mockResolvedValue(reqGetProducts);

        const res = await request(app)
        .get("/v1/product/all");

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(reqGetProducts);
        expect(ProductModel.find).toHaveBeenCalledWith();
    });
    });
    describe("GET /v1/product/:id", () => {
    it("should get a single product", async () => {
        const mockProduct = {
          _id: productId,
          user: userId,
          ...reqGetAProduct
        };
        (productService.getProductById as jest.Mock).mockResolvedValue(
          mockProduct
        );
        const res = await request(app)
        .get(`/v1/product/${productId}`)
        .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockProduct);
        expect(productService.getProductById).toHaveBeenCalledWith(productId);
    });

    it("should return 404 if product not found", async () => {
        (productService.getProductById as jest.Mock).mockRejectedValue(
          new ApiError(HttpStatusCodes.NOT_FOUND, "Product not found")
        );

        const res = await request(app)
        .get(`/v1/product/${productId}`)
        .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
      });
    });
    describe("PUT /v1/product/:id", () => {
        it("should update a product", async () => {
        const updatedData = { name: "Updated Product" };
        const mockProduct = {
            _id: productId,
            ...updatedData,
            user: userId,
        };
        (productService.updateAProduct as jest.Mock).mockResolvedValue(
            mockProduct
        );

        const res = await request(app)
            .put(`/v1/product/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedData);

        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockProduct);
        expect(productService.updateAProduct).toHaveBeenCalledWith(
            updatedData,
            productId,
            userId
        );
        });
    });
    describe("DELETE /v1/product/:id", () => {
    it("should delete a product", async () => {
      (productService.deleteAProduct as jest.Mock).mockResolvedValue(reqAddProduct);

      const res = await request(app)
        .delete(`/v1/product/${productId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(reqAddProduct);
      expect(productService.deleteAProduct).toHaveBeenCalledWith(
        productId,
        userId
      );
    });
  });
});
