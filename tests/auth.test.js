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
const server_1 = __importDefault(require("../src/server"));
const authService_1 = __importDefault(require("../src/services/authService"));
const User_1 = __importDefault(require("../src/models/User"));
const HttpStatusCodes_1 = __importDefault(require("../src/constants/HttpStatusCodes"));
const ApiError_1 = __importDefault(require("../src/utils/ApiError"));
jest.mock("../src/services/authService");
jest.mock("../src/models/User");
describe("Auth API", () => {
    const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        phone: "1234567890",
        password: "hashedpassword",
        verificationOTP: "123456",
        matchPassword: jest.fn(),
        getSignedJwtToken: jest.fn().mockReturnValue("mock.jwt.token"),
        toObject: function () {
            return Object.assign(Object.assign({}, this), { password: undefined });
        },
    };
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /auth/register", () => {
        it("should register a new user successfully (201)", () => __awaiter(void 0, void 0, void 0, function* () {
            authService_1.default.findUserByEmail.mockResolvedValue(null);
            authService_1.default.registerUser.mockResolvedValue(mockUser);
            const res = yield (0, supertest_1.default)(server_1.default).post("/v1/auth/register").send({
                email: "test@example.com",
                password: "password123",
                firstName: "Test",
                lastName: "User",
                phone: "1234567890",
            });
            expect(res.status).toBe(HttpStatusCodes_1.default.CREATED);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe("test@example.com");
            // Verify service was called
            expect(authService_1.default.registerUser).toHaveBeenCalledWith("test@example.com", "Test", "User", "1234567890", "password123");
        }));
        it("should reject duplicate registration (400)", () => __awaiter(void 0, void 0, void 0, function* () {
            authService_1.default.findUserByEmail.mockResolvedValue(mockUser);
            const res = yield (0, supertest_1.default)(server_1.default).post("/v1/auth/register").send({
                email: "test@example.com",
                password: "password123",
                firstName: "Test",
                lastName: "User",
                phone: "1234567890",
            });
            expect(res.status).toBe(HttpStatusCodes_1.default.BAD_REQUEST);
            expect(res.body.message).toContain("already exists");
        }));
    });
    describe("POST /v1/auth/login", () => {
        it("should login with valid credentials (200)", () => __awaiter(void 0, void 0, void 0, function* () {
            User_1.default.findOne.mockImplementation(() => ({
                select: jest.fn().mockResolvedValue(mockUser),
            }));
            mockUser.matchPassword.mockResolvedValue(true);
            authService_1.default.loginUser.mockResolvedValue(Object.assign(Object.assign({}, mockUser), { token: "mock.jwt.token" }));
            const res = yield (0, supertest_1.default)(server_1.default).post("/v1/auth/login").send({
                email: "test@example.com",
                password: "password123",
            });
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
            expect(res.body.data.token).toBeDefined();
            expect(authService_1.default.loginUser).toHaveBeenCalledWith("test@example.com", "password123");
        }));
        it("should reject login with wrong password (401)", () => __awaiter(void 0, void 0, void 0, function* () {
            authService_1.default.loginUser.mockRejectedValue(new ApiError_1.default(HttpStatusCodes_1.default.NOT_FOUND, "Wrong Password Entered"));
            const res = yield (0, supertest_1.default)(server_1.default).post("/v1/auth/login").send({
                email: "test@example.com",
                password: "wrongpassword",
            });
            expect(res.status).toBe(HttpStatusCodes_1.default.NOT_FOUND);
        }));
        it("should reject login for non-existent user (404)", () => __awaiter(void 0, void 0, void 0, function* () {
            authService_1.default.loginUser.mockRejectedValue(new ApiError_1.default(HttpStatusCodes_1.default.NOT_FOUND, "User doesn't exist"));
            const res = yield (0, supertest_1.default)(server_1.default)
                .post("/v1/auth/login")
                .send({
                email: "nonexistent@example.com",
                password: "password123",
            });
            expect(res.status).toBe(HttpStatusCodes_1.default.NOT_FOUND);
        }));
    });
    // describe("loginUser", () => {
    //   it("should return user with token when password matches", async () => {
    //     const userWithPassword = {
    //       ...mockUser,
    //       password: "hashedpassword",
    //       matchPassword: jest.fn().mockResolvedValue(true),
    //     };
    //     (UserModel.findOne as jest.Mock).mockReturnValue({
    //       select: jest.fn().mockResolvedValue(userWithPassword),
    //     });
    //     const result = await authService.loginUser(
    //       "test@example.com",
    //       "password123"
    //     );
    //     expect(result.token).toBe("mock.jwt.token");
    //     expect(result.password).toBeUndefined();
    //   });
    // });
});
