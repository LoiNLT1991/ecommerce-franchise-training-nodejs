import { Router } from "express";
import { API_PATH } from "../../core/constants";
import { BaseRole, RoleScope } from "../../core/enums";
import { IRoute } from "../../core/interfaces";
import { authMiddleware, requireGlobalRole, requireMoreContext, validationMiddleware } from "../../core/middleware";
import ChangeStatusDto from "./dto/changeStatus.dto";
import CreateUserDto from "./dto/create.dto";
import UpdateUserDto from "./dto/update.dto";
import UserController from "./user.controller";

export default class UserRoute implements IRoute {
  public path = API_PATH.USER;
  public router = Router();

  constructor(private readonly controller: UserController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: User
     *     description: User related endpoints
     */

    /**
     * @swagger
     * /api/users:
     *   post:
     *     summary: Create new user (Admin only)
     *     tags: [User]
     *     security:
     *       - Bearer: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: staff01@gmail.com
     *               password:
     *                 type: string
     *                 minLength: 8
     *                 example: Password@123
     *               name:
     *                 type: string
     *                 example: Staff Nguyen
     *               role:
     *                 type: string
     *                 example: STAFF
     *     responses:
     *       200:
     *         description: User created successfully
     *       401:
     *         description: Unauthorized - missing or invalid token
     *       403:
     *         description: Forbidden - only admin can create user
     */
    // POST domain:/api/users - Create user
    this.router.post(
      this.path,
      authMiddleware(),
      requireGlobalRole(),
      validationMiddleware(CreateUserDto),
      this.controller.createItem,
    );

    // POST domain:/api/users/search - Get all users
    this.router.post(
      API_PATH.USER_SEARCH,
      authMiddleware(),
      requireMoreContext([
        { scope: RoleScope.GLOBAL, roles: [BaseRole.SUPER_ADMIN, BaseRole.ADMIN] },
        { scope: RoleScope.FRANCHISE, roles: [BaseRole.MANAGER] },
      ]),
      this.controller.getItems,
    );

    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     summary: Get user by id
     *     tags: [User]
     *     security:
     *       - Bearer: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *         example: 6786117ca2e8a8cfbf2032bf
     *     responses:
     *       200:
     *         description: Get user information successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       example: 6786117ca2e8a8cfbf2032bf
     *                     email:
     *                       type: string
     *                       example: staff01@gmail.com
     *                     role:
     *                       type: string
     *                       example: staff
     *                     name:
     *                       type: string
     *                       example: Staff Nguyen
     *                     phone:
     *                       type: string
     *                       example: "0909123456"
     *       401:
     *         description: Unauthorized - missing or invalid token
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Unauthorized
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: User not found
     */
    // GET domain:/api/users/:id - Get user by id
    this.router.get(API_PATH.USER_ID, authMiddleware(), this.controller.getItem);

    // PUT domain:/api/users/:id/change-status -> Change user status (block/unBlock)
    this.router.put(
      API_PATH.USER_CHANGE_STATUS,
      authMiddleware(),
      requireMoreContext([
        { scope: RoleScope.GLOBAL, roles: [BaseRole.SUPER_ADMIN, BaseRole.ADMIN] },
        { scope: RoleScope.FRANCHISE, roles: [BaseRole.MANAGER] },
      ]),
      validationMiddleware(ChangeStatusDto),
      this.controller.changeStatus,
    );

    // PUT domain:/api/users/:id -> Update user
    // this.router.put(
    //   `${this.path}/:id`,
    //   authMiddleware(),
    //   validationMiddleware(UpdateUserDto),
    //   this.controller.updateUser,
    // );
  }
}
