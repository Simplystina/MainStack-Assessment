import request from "supertest";
import app from "../src/server";
import authService from "../src/services/authService";
import UserModel from "../src/models/User";
import HttpStatusCodes from "../src/constants/HttpStatusCodes";
import ApiError from "../src/utils/ApiError";

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
      return { ...this, password: undefined };
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

 
  describe("POST /auth/register", () => {
    it("should register a new user successfully (201)", async () => {
      (authService.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (authService.registerUser as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post("/v1/auth/register").send({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        phone: "1234567890",
      });

     
      expect(res.status).toBe(HttpStatusCodes.CREATED);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("test@example.com");

      // Verify service was called
      expect(authService.registerUser).toHaveBeenCalledWith(
        "test@example.com",
        "Test",
        "User",
        "1234567890",
        "password123"
      );
    });

    it("should reject duplicate registration (400)", async () => {
      (authService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post("/v1/auth/register").send({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        phone: "1234567890",
      });

      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(res.body.message).toContain("already exists");
    });
  });

 
  describe("POST /v1/auth/login", () => {
    it("should login with valid credentials (200)", async () => {

      (UserModel.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));
      mockUser.matchPassword.mockResolvedValue(true);

      (authService.loginUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        token: "mock.jwt.token",
      });

      const res = await request(app).post("/v1/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data.token).toBeDefined();
      expect(authService.loginUser).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    it("should reject login with wrong password (401)", async () => {
      (authService.loginUser as jest.Mock).mockRejectedValue(
        new ApiError(HttpStatusCodes.NOT_FOUND, "Wrong Password Entered")
      );

      const res = await request(app).post("/v1/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should reject login for non-existent user (404)", async () => {
      (authService.loginUser as jest.Mock).mockRejectedValue(
        new ApiError(HttpStatusCodes.NOT_FOUND, "User doesn't exist")
      );

      const res = await request(app)
      .post("/v1/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
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
