import { NextFunction } from "express";
import { requireAuth } from "./middleware";

describe("Auth Middleware Tests", () => {

  let req: any, res: any, next: any;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  it("Should call next if user is authenticated", () => {
    
    // Mock isAuthenticated to be true in request object 
    req.isAuthenticated = jest.fn(() => true);

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  })

  it("Should return 401 if user is not authenticated", () => {
    req.isAuthenticated = jest.fn(() => false);

    requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  })

})