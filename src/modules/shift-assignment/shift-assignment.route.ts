import { Router } from "express";
import {
  API_PATH,
  authMiddleware,
  IRoute,
  SYSTEM_AND_FRANCHISE_ALL_ROLES,
  validationMiddleware,
  SYSTEM_AND_FRANCHISE_MANAGER_ROLES,
  requireMoreContext,
} from "../../core";
import { ShiftAssignmentController } from "./shift-assignment.controller";
import { CreateShiftAssignmentDto } from "./dto/create.dto";
import { UpdateShiftAssignmentDto } from "./dto/update.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";

export default class ShiftAssignmentRoute implements IRoute {
  public path = API_PATH.SHIFT_ASSIGNMENT;
  public router = Router();

  constructor(private readonly controller: ShiftAssignmentController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: ShiftAssignment
     *     description: Shift assignment related endpoints
     */

    /**
     * @swagger
     * /api/shift-assignments/search:
     *   post:
     *     summary: Search shift assignments with pagination
     *     tags: [ShiftAssignment]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SearchPaginationItemDto'
     *     responses:
     *       200:
     *         description: Get shift assignments successfully
     */
    this.router.post(
      API_PATH.SHIFT_ASSIGNMENT_SEARCH,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_ALL_ROLES),
      validationMiddleware(SearchPaginationItemDto),
      this.controller.getItems,
    );

    /**
     * @swagger
     * /api/shift-assignments:
     *   post:
     *     summary: Create new shift assignment
     *     tags: [ShiftAssignment]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateShiftAssignmentDto'
     *     responses:
     *       200:
     *         description: Created successfully
     */
    this.router.post(
      API_PATH.SHIFT_ASSIGNMENT,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationMiddleware(CreateShiftAssignmentDto),
      this.controller.createItem,
    );

    /**
     * @swagger
     * /api/shift-assignments/{id}:
     *   get:
     *     summary: Get shift assignment detail
     *     tags: [ShiftAssignment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Get shift assignment successfully
     */
    this.router.get(
      API_PATH.SHIFT_ASSIGNMENT_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_ALL_ROLES),
      this.controller.getById,
    );

    /**
     * @swagger
     * /api/shift-assignments/{id}:
     *   put:
     *     summary: Update shift assignment
     *     tags: [ShiftAssignment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateShiftAssignmentDto'
     *     responses:
     *       200:
     *         description: Updated successfully
     */
    this.router.put(
      API_PATH.SHIFT_ASSIGNMENT_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationMiddleware(UpdateShiftAssignmentDto),
      this.controller.updateItem,
    );

    /**
     * @swagger
     * /api/shift-assignments/{id}:
     *   delete:
     *     summary: Soft delete shift assignment
     *     tags: [ShiftAssignment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Deleted successfully
     */
    this.router.delete(
      API_PATH.SHIFT_ASSIGNMENT_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.softDeleteItem,
    );

    /**
     * @swagger
     * /api/shift-assignments/{id}/restore:
     *   patch:
     *     summary: Restore shift assignment
     *     tags: [ShiftAssignment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Restored successfully
     */
    this.router.patch(
      API_PATH.SHIFT_ASSIGNMENT_RESTORE,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.restoreItem,
    );

    /**
     * @swagger
     * /api/shift-assignments/{id}/change-status:
     *   patch:
     *     summary: Change shift assignment status
     *     tags: [ShiftAssignment]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateShiftAssignmentDto'
     *     responses:
     *       200:
     *         description: Changed successfully
     */
    this.router.patch(
      API_PATH.SHIFT_ASSIGNMENT_CHANGE_STATUS,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_ALL_ROLES),
      this.controller.changeStatus,
    );
  }
}
