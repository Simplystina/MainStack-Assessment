import { Request } from "express";

export interface ProductType {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}
