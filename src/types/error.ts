// src/types/error.ts
export interface BaseError extends Error {
  name: string;
  statusCode: number;
}

export interface ValidationErrorDetails {
  path: string;
  kind: string;
  value?: any;
  message: string;
}

export enum ErrorType {
  CAST_ERROR = "CastError",
  VALIDATION_ERROR = "ValidationError",
  DUPLICATE_KEY_ERROR = "DuplicateKeyError",
  INTERNAL_SERVER_ERROR = "InternalServerError",
}

export interface CustomError extends BaseError {
  name: ErrorType;
  value?: string;
  errors: ValidationErrorDetails[];
}

export interface ValidationError extends CustomError {
  details: ValidationErrorDetails[];
}