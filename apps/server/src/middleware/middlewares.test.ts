import { NextFunction } from "express";
import { errorHandler, notFound } from "./middlewares";

describe("Middlewares Tests", () => {

  describe("notFound", () => {

    it("Should set status to 404 and call next with an error", () => {
      const req = {} as Request;
      const res = {
        status: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;
  
      // @ts-expect-error
      notFound(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  
  describe("errorHandler", () => {
    it("Should set status and send JSON response with error message and stack trace", () => {
      const err = new Error('Test error');
      const req = {} as Request;
      const res = {
        statusCode: 500,
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as unknown as NextFunction;
  
      // @ts-expect-error
      errorHandler(err, req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error',
        stack: expect.any(String),
      });
    });
  
    it("Should send stack trace only in development environment", () => {
      const err = new Error('Test error');
      const req = {} as Request;
      const res = {
        statusCode: 500,
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as unknown as NextFunction;
  
      process.env.NODE_ENV = 'development';
      // @ts-expect-error
      errorHandler(err, req, res, next);
  
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error',
        stack: expect.any(String),
      });
  
      process.env.NODE_ENV = 'production';
      // @ts-expect-error
      errorHandler(err, req, res, next);
  
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error',
        stack: '🥞',
      });
    });
  });

})


