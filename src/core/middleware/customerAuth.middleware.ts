import { RequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpStatus } from "../enums";
import { authFormatResponse, getTokenFromRequest, verifyCustomerToken } from "./auth.helper";

const customerAuthMiddleware = (): RequestHandler => {
  return async (req, res, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      if (req.cookies?.customer_refresh_token) {
        return res.status(HttpStatus.Unauthorized).json(authFormatResponse("CUSTOMER_ACCESS_TOKEN_EXPIRED"));
      }

      return res
        .status(HttpStatus.Unauthorized)
        .json(authFormatResponse("You are not logged in. Please log in to continue!"));
    }
    
    try {
      const payload = await verifyCustomerToken(token);
      req.user = payload;
      next();
    } catch (err) {
      // Token hết hạn
      if (err instanceof TokenExpiredError) {
        return res.status(HttpStatus.Unauthorized).json(authFormatResponse("Access token has expired"));
      }

      // Token sai / bị sửa
      if (err instanceof JsonWebTokenError) {
        return res.status(HttpStatus.Unauthorized).json(authFormatResponse("Invalid token"));
      }

      // fallback
      return res.status(HttpStatus.Unauthorized).json(authFormatResponse("Token expired or invalid"));
    }
  };
};

export default customerAuthMiddleware;
