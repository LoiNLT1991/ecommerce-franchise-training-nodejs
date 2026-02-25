import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    BaseFieldName,
    checkEmptyObject,
    encodePassword,
    generateRandomPassword,
    HttpException,
    HttpStatus,
    MailService,
    MailTemplate,
} from "../../core";
import { AUTH_CONFIG } from "../auth/auth.config";
import { ICustomer, ICustomerQuery } from "../customer";
import ChangePasswordDto from "./dto/changePassword.dto";
import LoginDto from "./dto/login.dto";

export class CustomerAuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly customerQuery: ICustomerQuery,
  ) {}

  public async login(model: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    await checkEmptyObject(model);

    const { email, password } = model;

    // 1. Validate email
    const item = await this.customerQuery.getByEmail(email);
    if (!item || item.is_deleted || !item.is_active) {
      throw new HttpException(HttpStatus.BadRequest, "Email does not exist or is not eligible for login");
    }

    // check status user
    if (item.is_deleted || !item.is_active) {
      const reason = !item.is_active
        ? "locked. Please contact staff to activate!"
        : "deleted. Please contact staff for assistance!";
      throw new HttpException(HttpStatus.Forbidden, `Your account has been ${reason}`);
    }

    // check email verified
    if (!item.is_verified) {
      throw new HttpException(HttpStatus.BadRequest, "User is not verified! Please check your email in 24h!");
    }

    // check password match
    const isMatchPassword = await bcryptjs.compare(password, item.password!);
    if (!isMatchPassword) {
      throw new HttpException(HttpStatus.BadRequest, "Password incorrect");
    }

    const tokens = await this.createTokens(item);
    return tokens;
  }

  public async logout(userId: string): Promise<void> {
    const item = await this.customerQuery.increaseTokenVersion(userId);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Logout failed.");
    }
  }

  public async getProfile(id: string): Promise<ICustomer> {
    const item = await this.customerQuery.getById(id);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Customer does not exist");
    }
    return item;
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: any;

    // 1️⃣ Verify refresh token
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_CUSTOMER_REFRESH_SECRET!);
    } catch (error) {
      throw new HttpException(HttpStatus.Unauthorized, "Invalid or expired refresh token");
    }

    // 2️⃣ Get customer
    const customer = await this.customerQuery.getById(payload.id);
    if (!customer) {
      throw new HttpException(HttpStatus.Unauthorized, "Customer does not exist");
    }

    // 3️⃣ Check token version (logout protection)
    if (customer.token_version !== payload.version) {
      throw new HttpException(HttpStatus.Unauthorized, "Token has been revoked");
    }

    // 5️⃣ Generate new tokens
    return this.createTokens(customer);
  }

  public async verifyCustomerToken(token: string): Promise<void> {
    // 1. Get customer by token
    const customer = await this.customerQuery.getByToken(token);

    // 2. Verify token
    await this.verifyToken(customer, BaseFieldName.VERIFICATION_TOKEN_EXPIRES);

    // 3. Update customer via Query (business meaning)
    const updatedCustomer = await this.customerQuery.updateCustomerTokenVersion(customer!._id.toString());

    if (!updatedCustomer) {
      throw new HttpException(HttpStatus.BadRequest, "Verify customer token failed");
    }
  }

  public async resendCustomerToken(email: string, originDomain?: string | undefined): Promise<void> {
    // 1. Get customer
    const customer = await this.customerQuery.getByEmail(email);
    if (!customer || customer.is_verified) {
      throw new HttpException(HttpStatus.BadRequest, "Email does not exist or verified");
    }

    // 2. Update customer via Query
    const updatedCustomer = await this.customerQuery.updateCustomerResendToken(customer._id.toString());
    if (!updatedCustomer) {
      throw new HttpException(HttpStatus.BadRequest, "Resend verification token failed");
    }

    // 3. Send mail (side-effect)
    try {
      await this.mailService.send({
        to: updatedCustomer.email,
        ...MailTemplate.verifyEmail(
          updatedCustomer.name || updatedCustomer.email,
          updatedCustomer.verification_token || "",
          originDomain,
          true,
        ),
      });
    } catch (error) {
      // log error
      throw new HttpException(HttpStatus.BadRequest, "Failed to send verification email");
    }
  }

  public async forgotCustomerPassword(email: string): Promise<void> {
    const COOL_DOWN_MINUTES = 10;

    // 1. Get item
    const item = await this.customerQuery.getByEmail(email);

    if (!item || item.is_deleted || !item.is_active || !item.is_verified) {
      throw new HttpException(HttpStatus.BadRequest, "Customer does not exist or is not eligible for password reset");
    }

    // 2. 🔒 COOL_DOWN CHECK
    if (item.last_reset_password_at) {
      const diff = Date.now() - item.last_reset_password_at.getTime();

      if (diff < COOL_DOWN_MINUTES * 60 * 1000) {
        throw new HttpException(
          HttpStatus.TooManyRequests,
          `Please wait ${COOL_DOWN_MINUTES} minutes before requesting another password reset`,
        );
      }
    }

    // 3. Generate new password
    const generateNewPassword = generateRandomPassword(10);
    const newPassword = await encodePassword(generateNewPassword);

    // 4. Update item via Query
    const updatedItem = await this.customerQuery.updateCustomerPassword(item._id.toString(), newPassword, true);

    if (!updatedItem) {
      throw new HttpException(HttpStatus.BadRequest, "Failed to reset password");
    }

    // 4. Send new password email (side-effect)
    try {
      await this.mailService.send({
        to: item.email,
        ...MailTemplate.resetPassword(item.name || item.email, generateNewPassword),
      });
    } catch (error) {
      // log error here if needed
      throw new HttpException(HttpStatus.BadRequest, "Failed to send reset password email");
    }
  }

  public async changeCustomerPassword(model: ChangePasswordDto, loggedUserId: string): Promise<void> {
    await checkEmptyObject(model);

    // 1. Get item
    const item = await this.customerQuery.getById(loggedUserId, true);
    if (!item) {
      throw new HttpException(HttpStatus.BadRequest, "Customer does not exist");
    }

    // 2. Check old_password match
    const isMatchPassword = await bcryptjs.compare(model.old_password, item.password!);
    if (!isMatchPassword) {
      throw new HttpException(HttpStatus.Unauthorized, `Your old password is not valid!`);
    }

    // 3. Compare new_password vs old_password
    if (model.new_password === model.old_password) {
      throw new HttpException(HttpStatus.BadRequest, `New password must be different from old password`);
    }

    // 4. Update new password
    const newPassword = await encodePassword(model.new_password);
    const updatedUser = await this.customerQuery.updateCustomerPassword(item._id.toString(), newPassword, false);

    if (!updatedUser) throw new HttpException(HttpStatus.BadRequest, "Change password failed!");
  }

  // Helper functions
  private async verifyToken<T>(entity: T | null, expireField: keyof T) {
    if (!entity) throw new Error("Token not valid");

    if (!entity[expireField]) throw new Error("Missing expiration");

    if (Date.now() > new Date(entity[expireField] as any).getTime()) {
      throw new Error("Token expired");
    }
  }

  private createTokens(item: ICustomer) {
    const payload = {
      id: item._id.toString(),
      version: item.token_version,
      type: "customer",
    };

    const accessToken = jwt.sign(payload, process.env.JWT_CUSTOMER_ACCESS_SECRET!, {
      expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_CUSTOMER_REFRESH_SECRET!, {
      expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
}
