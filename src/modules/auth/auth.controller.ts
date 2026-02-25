import { CookieOptions, NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/enums";
import { HttpException } from "../../core/exceptions";
import { AuthenticatedUserRequest } from "../../core/models";
import { formatResponse } from "../../core/utils";
import { IUser } from "../user";
import { AUTH_CONFIG, TOKEN } from "./auth.config";
import { mapAuthToResponse } from "./auth.mapper";
import AuthService from "./auth.service";
import { RegisterDto } from "./dto/authCredential.dto";
import { AuthResponseDto } from "./dto/authResponse.dto";
import ChangePasswordDto from "./dto/changePassword.dto";
import { SwitchContextDto } from "./dto/switchContext.dto";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      const item = await this.authService.register(model, req.get("Origin"));
      res.status(HttpStatus.Success).json(formatResponse<IUser>(item));
    } catch (error) {
      next(error);
    }
  };

  public verifyUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.verifyUserToken(req.body.token);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public resendToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.resendToken(req.body.email, req.get("Origin"));
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public loginWithCookie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.login(req.body);
      const { accessToken, refreshToken } = tokens;

      // 🔥 Set cookies
      this.setAccessToken(res, accessToken);
      this.setRefreshToken(res, refreshToken);

      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public loginForSwagger = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.login(req.body);
      return res.status(HttpStatus.Success).json(formatResponse(tokens));
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout((req as AuthenticatedUserRequest).user.id);

      // ✅ Clear access token (path '/') + refresh token (path '/auth')
      this.clearAuthCookies(res);

      return res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public getLoginUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as AuthenticatedUserRequest).user;
      const { user, roles } = await this.authService.getLoginUserInfo((req as AuthenticatedUserRequest).user.id);
      res
        .status(HttpStatus.Success)
        .json(formatResponse<AuthResponseDto>(mapAuthToResponse(user, roles, authUser.context ?? null)));
    } catch (error) {
      next(error);
    }
  };

  public switchContext = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: SwitchContextDto = req.body;
      const franchiseId: string | null = payload.franchise_id === undefined ? null : payload.franchise_id;
      const tokens = await this.authService.switchContext(franchiseId, (req as AuthenticatedUserRequest).user.id);
      const { accessToken, refreshToken } = tokens;

      // 3️⃣ Set lại cookies
      this.setAccessToken(res, accessToken);
      this.setRefreshToken(res, refreshToken);

      return res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1️⃣ Lấy refresh token từ COOKIE
      const refreshToken = req.cookies[TOKEN.REFRESH_TOKEN];

      if (!refreshToken) {
        throw new HttpException(HttpStatus.Unauthorized, "Refresh token is missing");
      }

      // 2️⃣ Gọi service để verify + tạo token mới
      const tokens = await this.authService.refreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = tokens;

      // 3️⃣ Set lại cookies
      this.setAccessToken(res, accessToken);
      this.setRefreshToken(res, newRefreshToken);

      return res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.forgotPassword(req.body.email);
      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: ChangePasswordDto = req.body;
      await this.authService.changePassword(model, (req as AuthenticatedUserRequest).user);
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
    res.cookie(TOKEN.ACCESS_TOKEN, token, {
      ...this.baseCookieOptions,
      maxAge: AUTH_CONFIG.ACCESS_COOKIE_MAX_AGE,
    });
  }

  private setRefreshToken(res: Response, token: string, options?: { path?: string }) {
    res.cookie(TOKEN.REFRESH_TOKEN, token, {
      ...this.baseCookieOptions,
      path: options?.path ?? "/",
      maxAge: AUTH_CONFIG.REFRESH_COOKIE_MAX_AGE,
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie(TOKEN.ACCESS_TOKEN, {
      ...this.baseCookieOptions,
      path: "/",
    });

    res.clearCookie(TOKEN.REFRESH_TOKEN, {
      ...this.baseCookieOptions,
      path: "/",
    });
  }
}
