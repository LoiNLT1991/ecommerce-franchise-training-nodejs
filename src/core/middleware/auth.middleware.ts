import { RequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpStatus } from "../enums";
import { authFormatResponse, verifyCustomerToken, verifyUserToken } from "./auth.helper";

export const authMiddleware = (): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userToken = req.cookies?.access_token;
      const customerToken = req.cookies?.customer_access_token;

      if (!userToken && !customerToken) {
        if (req.cookies?.refresh_token) {
          return res.status(HttpStatus.Unauthorized).json(authFormatResponse("ACCESS_TOKEN_EXPIRED"));
        }

        if (req.cookies?.customer_refresh_token) {
          return res.status(HttpStatus.Unauthorized).json(authFormatResponse("CUSTOMER_ACCESS_TOKEN_EXPIRED"));
        }

        return res
          .status(HttpStatus.Unauthorized)
          .json(authFormatResponse("You are not logged in. Please log in to continue!"));
      }

      // check user
      if (userToken) {
        try {
          const payload = await verifyUserToken(userToken);
          req.user = payload;
          return next();
        } catch {}
      }

      // check customer
      if (customerToken) {
        try {
          const payload = await verifyCustomerToken(customerToken);
          req.user = payload;
          return next();
        } catch {}
      }

      return res.status(HttpStatus.Unauthorized).json(authFormatResponse("Invalid token"));
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(HttpStatus.Unauthorized).json(authFormatResponse("Access token has expired"));
      }

      if (err instanceof JsonWebTokenError) {
        return res.status(HttpStatus.Unauthorized).json(authFormatResponse("Invalid token"));
      }

      return res.status(HttpStatus.Unauthorized).json(authFormatResponse("Token expired or invalid"));
    }
  };
};
