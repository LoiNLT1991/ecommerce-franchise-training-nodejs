import { Router } from "express";
import { API_PATH, customerAuthMiddleware, IRoute, validationMiddleware } from "../../core";
import CustomerAuthController from "./customer-auth.controller";
import ChangePasswordDto from "./dto/changePassword.dto";
import LoginDto from "./dto/login.dto";

export default class CustomerAuthRoute implements IRoute {
  public path = API_PATH.CUSTOMER_AUTH;
  public router = Router();

  constructor(private readonly controller: CustomerAuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Customer Auth
     *     description: Customer authentication related endpoints
     */

    // POST domain:/api/customer-auth -> Login (auto set cookie)
    this.router.post(this.path, validationMiddleware(LoginDto), this.controller.login);

    // POST domain:/api/customer-auth/logout -> Logout
    this.router.post(API_PATH.CUSTOMER_AUTH_LOGOUT, customerAuthMiddleware(), this.controller.logout);

    // GET domain:/api/customer-auth -> Get profile of logged in customer
    this.router.get(this.path, customerAuthMiddleware(), this.controller.getProfile);

        // GET domain:/api/customer-auth/refresh-token -> Refresh Token
    this.router.get(API_PATH.CUSTOMER_AUTH_REFRESH_TOKEN, this.controller.refreshToken);

    // POST domain:/api/customer-auth/verify-token -> Verify token for new user
    this.router.post(API_PATH.CUSTOMER_AUTH_VERIFY_TOKEN, this.controller.verifyToken);

    // POST domain:/api/customer-auth/resend-token -> Resend Token via email
    this.router.post(API_PATH.CUSTOMER_AUTH_RESEND_TOKEN, this.controller.resendToken);

    // PUT domain:/api/customer-auth/forgot-password -> Forgot password
    this.router.put(API_PATH.CUSTOMER_AUTH_FORGOT_PASSWORD, this.controller.forgotPassword);

    // PUT domain:/api/customer-auth/change-password -> Change password
    this.router.put(
      API_PATH.CUSTOMER_AUTH_CHANGE_PASSWORD,
      customerAuthMiddleware(),
      validationMiddleware(ChangePasswordDto),
      this.controller.changePassword,
    );
  }
}
