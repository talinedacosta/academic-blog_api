import { env } from "@/env";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface ErrorHandlerMap { 
  [key: string]: (error: Error | ZodError, request: Request, response: Response) => void;
}

export const errorHandlerMap: ErrorHandlerMap = {
  ZodError: (error, request, response) => {
    const stack = env.NODE_ENV === "development" ? error.stack : {};
    response.status(400).json({ message: "Validation error", errors: (error as ZodError).format(), stack });
  },
  ResourceNotFoundError: (error, request, response) => {
    const stack = env.NODE_ENV === "development" ? error.stack : {};
    response.status(404).json({ message: error.message, stack });
  },
  default: (error, request: Request, response: Response) => {
    response.status(500).json({ message: "Internal server error" });
  }
};

export const globalErrorHandler = (error: Error | ZodError, request: Request, response: Response, next: NextFunction) => {

  if(env.NODE_ENV === "development") {
    console.error(error);
  }

  const errorHandler = errorHandlerMap[error.constructor.name] || errorHandlerMap.default;
  
  return errorHandler(error, request, response);
}