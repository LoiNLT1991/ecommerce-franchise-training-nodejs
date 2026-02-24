import { Router } from "express";
import { API_PATH, SYSTEM_ADMIN_ROLES, SYSTEM_AND_FRANCHISE_MANAGER_ROLES } from "../../core/constants";
import { IRoute } from "../../core/interfaces";
import { authMiddleware, requireMoreContext, validationMiddleware } from "../../core/middleware";
import CreateUserDto from "./dto/create.dto";
import UpdateUserDto from "./dto/update.dto";
import UserController from "./user.controller";
import { UpdateStatusDto } from "../../core";

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

    // PATCH domain:/api/users/:id/status -> Change user status (block/unBlock)
    this.router.patch(
      API_PATH.USER_CHANGE_STATUS,
      authMiddleware(),
      requireMoreContext(SYSTEM_ADMIN_ROLES),
      validationMiddleware(UpdateStatusDto),
      this.controller.changeStatus,
    );

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
    // POST domain:/api/users - Create item
    this.router.post(
      this.path,
      authMiddleware(),
      requireMoreContext(SYSTEM_ADMIN_ROLES),
      validationMiddleware(CreateUserDto),
      this.controller.createItem,
    );

    // POST domain:/api/users/search - Search items with pagination
    this.router.post(
      API_PATH.USER_SEARCH,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
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
    // GET domain:/api/users/:id - Get item
    this.router.get(API_PATH.USER_ID, authMiddleware(), this.controller.getItem);

    // PUT domain:/api/users/:id - Update item
    this.router.put(
      API_PATH.USER_ID,
      authMiddleware(),
      validationMiddleware(UpdateUserDto),
      this.controller.updateItem,
    );

    // DELETE domain:/api/users/:id - Soft delete item
    this.router.delete(
      API_PATH.USER_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_ADMIN_ROLES),
      this.controller.softDeleteItem,
    );

    // PATCH domain:/api/users/:id/restore - Restore soft deleted item
    this.router.patch(
      API_PATH.USER_RESTORE,
      authMiddleware(),
      requireMoreContext(SYSTEM_ADMIN_ROLES),
      this.controller.restoreItem,
    );
  }
}
