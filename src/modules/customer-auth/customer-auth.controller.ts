import { CookieOptions, NextFunction, Request, Response } from "express";
import { AuthenticatedCustomerRequest, AuthenticatedUserRequest, formatResponse, HttpException, HttpStatus } from "../../core";
import { AUTH_CONFIG, TOKEN } from "../auth/auth.config";
import { CustomerAuthService } from "./customer-auth.service";
import ChangePasswordDto from "./dto/changePassword.dto";
import LoginDto from "./dto/login.dto";
import { mapItemToResponse } from "../customer";

export default class CustomerAuthController {
  constructor(private readonly service: CustomerAuthService) {}

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;
      const tokens = await this.service.login(model);

      const { accessToken, refreshToken } = tokens;

      // 🔥 Set cookies
      this.setAccessToken(res, accessToken);
      this.setRefreshToken(res, refreshToken);

      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.logout((req as AuthenticatedCustomerRequest).user.id);

      // ✅ Clear access token (path '/') + refresh token (path '/auth')
      this.clearAuthCookies(res);

      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.service.getProfile((req as AuthenticatedCustomerRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse(mapItemToResponse(profile)));
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1️⃣ Lấy refresh token từ COOKIE
      const refreshToken = req.cookies[TOKEN.CUSTOMER_REFRESH_TOKEN];

      if (!refreshToken) {
        throw new HttpException(HttpStatus.Unauthorized, "Customer refresh token is missing");
      }

      // 2️⃣ Gọi service để verify + tạo token mới
      const tokens = await this.service.refreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = tokens;

      // 3️⃣ Set lại cookies
      this.setAccessToken(res, accessToken);
      this.setRefreshToken(res, newRefreshToken);

      return res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.verifyCustomerToken(req.body.token);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public resendToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.resendCustomerToken(req.body.email, req.get("Origin"));
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.forgotCustomerPassword(req.body.email);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: ChangePasswordDto = req.body;
      await this.service.changeCustomerPassword(model, (req as AuthenticatedUserRequest).user.id);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  // ===== PRIVATE HELPERS =====
  private readonly baseCookieOptions: CookieOptions =
    process.env.NODE_ENV === "production"
      ? {
          httpOnly: true,
          secure: true, // 🔴 BẮT BUỘC
          sameSite: "none", // 🔴 BẮT BUỘC cho cross-domain
          path: "/",
        }
      : {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        };

  private setAccessToken(res: Response, token: string) {
    res.cookie(TOKEN.CUSTOMER_ACCESS_TOKEN, token, {
      ...this.baseCookieOptions,
      maxAge: AUTH_CONFIG.ACCESS_COOKIE_MAX_AGE,
    });
  }

  private setRefreshToken(res: Response, token: string, options?: { path?: string }) {
    res.cookie(TOKEN.CUSTOMER_REFRESH_TOKEN, token, {
      ...this.baseCookieOptions,
      path: options?.path ?? "/",
      maxAge: AUTH_CONFIG.REFRESH_COOKIE_MAX_AGE,
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie(TOKEN.CUSTOMER_ACCESS_TOKEN, {
      ...this.baseCookieOptions,
      path: "/",
    });

    res.clearCookie(TOKEN.CUSTOMER_REFRESH_TOKEN, {
      ...this.baseCookieOptions,
      path: "/",
    });
  }
}
