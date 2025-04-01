"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server")); // Assuming your Express app is exported from here
const Products_1 = __importDefault(require("../src/models/Products"));
const productService_1 = __importDefault(require("../src/services/productService"));
const HttpStatusCodes_1 = __importDefault(require("../src/constants/HttpStatusCodes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const product_test_data_1 = require("../src/utils/data/product.test.data");
const dotenv_1 = __importDefault(require("dotenv"));
const ApiError_1 = __importDefault(require("../src/utils/ApiError"));
dotenv_1.default.config();
//jest.mock("../models/Products");
// Mock the ProductModel and productService
jest.mock("../src/models/Products");
jest.mock("../src/services/productService");
describe("Product API Endpoints", () => {
    let token;
    const userId = "67e6c72b501df5f23aa676d6";
    const productId = "507f1f77bcf86cd799439011";
    let email = "john.doe@example.com";
    let secret = process.env.JWT_SECRET;
    beforeAll(() => {
        token = jsonwebtoken_1.default.sign({ user_id: userId, email: email }, secret, {
            expiresIn: "1h",
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /products", () => {
        it("should create a product", () => __awaiter(void 0, void 0, void 0, function* () {
            productService_1.default.createProduct.mockResolvedValue(product_test_data_1.reqAddProduct);
            const res = yield (0, supertest_1.default)(server_1.default)
                .post("/v1/product")
                .set("Authorization", `Bearer ${token}`)
                .send(product_test_data_1.reqAddProduct);
            expect(res.status).toBe(HttpStatusCodes_1.default.CREATED);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(product_test_data_1.reqAddProduct);
            expect(productService_1.default.createProduct).toHaveBeenCalledWith(product_test_data_1.reqAddProduct, userId);
        }));
    });
    describe("GET /v1/product", () => {
        it("should get all products for the authenticated user", () => __awaiter(void 0, void 0, void 0, function* () {
            Products_1.default.find.mockResolvedValue(product_test_data_1.reqGetProducts);
            const res = yield (0, supertest_1.default)(server_1.default)
                .get("/v1/product")
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(product_test_data_1.reqGetProducts);
            expect(Products_1.default.find).toHaveBeenCalledWith({ user: userId });
        }));
    });
    describe("GET /v1/product/all", () => {
        it("should get all products", () => __awaiter(void 0, void 0, void 0, function* () {
            Products_1.default.find.mockResolvedValue(product_test_data_1.reqGetProducts);
            const res = yield (0, supertest_1.default)(server_1.default)
                .get("/v1/product/all");
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(product_test_data_1.reqGetProducts);
            expect(Products_1.default.find).toHaveBeenCalledWith();
        }));
    });
    describe("GET /v1/product/:id", () => {
        it("should get a single product", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProduct = Object.assign({ _id: productId, user: userId }, product_test_data_1.reqGetAProduct);
            productService_1.default.getProductById.mockResolvedValue(mockProduct);
            const res = yield (0, supertest_1.default)(server_1.default)
                .get(`/v1/product/${productId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockProduct);
            expect(productService_1.default.getProductById).toHaveBeenCalledWith(productId);
        }));
        it("should return 404 if product not found", () => __awaiter(void 0, void 0, void 0, function* () {
            productService_1.default.getProductById.mockRejectedValue(new ApiError_1.default(HttpStatusCodes_1.default.NOT_FOUND, "Product not found"));
            const res = yield (0, supertest_1.default)(server_1.default)
                .get(`/v1/product/${productId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(HttpStatusCodes_1.default.NOT_FOUND);
        }));
    });
    describe("PUT /v1/product/:id", () => {
        it("should update a product", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedData = { name: "Updated Product" };
            const mockProduct = Object.assign(Object.assign({ _id: productId }, updatedData), { user: userId });
            productService_1.default.updateAProduct.mockResolvedValue(mockProduct);
            const res = yield (0, supertest_1.default)(server_1.default)
                .put(`/v1/product/${productId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedData);
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockProduct);
            expect(productService_1.default.updateAProduct).toHaveBeenCalledWith(updatedData, productId, userId);
        }));
    });
    describe("DELETE /v1/product/:id", () => {
        it("should delete a product", () => __awaiter(void 0, void 0, void 0, function* () {
            productService_1.default.deleteAProduct.mockResolvedValue(product_test_data_1.reqAddProduct);
            const res = yield (0, supertest_1.default)(server_1.default)
                .delete(`/v1/product/${productId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(product_test_data_1.reqAddProduct);
            expect(productService_1.default.deleteAProduct).toHaveBeenCalledWith(productId, userId);
        }));
    });
});
