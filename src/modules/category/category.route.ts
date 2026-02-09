import { Router } from "express";
import { API_PATH, SYSTEM_AND_FRANCHISE_MANAGER_ROLES } from "../../core/constants";
import { IRoute } from "../../core/interfaces";
import { authMiddleware, requireMoreContext, validationMiddleware } from "../../core/middleware";
import { CategoryController } from "./category.controller";
import CreateCategoryDto from "./dto/create.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import UpdateCategoryDto from "./dto/update.dto";

export default class CategoryRoute implements IRoute {
  public path = API_PATH.CATEGORY;
  public router = Router();

  constructor(private readonly controller: CategoryController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Category
     *     description: Category related endpoints
     */

    // TODO: check again when have module customer
    // GET domain:/api/categories/select - Get all categories for select option
    this.router.get(API_PATH.CATEGORY_SELECT, this.controller.getAllCategories);

    // POST domain:/api/categories - Create category
    this.router.post(
      this.path,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationMiddleware(CreateCategoryDto),
      this.controller.createItem,
    );

    // POST domain:/api/categories/search - Get all categories
    this.router.post(
      API_PATH.CATEGORY_SEARCH,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationMiddleware(SearchPaginationItemDto, true, {
        enableImplicitConversion: false,
      }),
      this.controller.getItems,
    );

    // GET domain:/api/categories/:id - Get category by id
    this.router.get(
      API_PATH.CATEGORY_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.getItem,
    );

    // PUT domain:/api/categories/:id - Update category
    this.router.put(
      API_PATH.CATEGORY_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      validationMiddleware(UpdateCategoryDto),
      this.controller.updateItem,
    );

    // DELETE domain:/api/categories/:id - Soft delete category
    this.router.delete(
      API_PATH.CATEGORY_ID,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.softDeleteItem,
    );

    // PATCH domain:/api/categories/:id/restore - Restore soft deleted category
    this.router.patch(
      API_PATH.CATEGORY_RESTORE,
      authMiddleware(),
      requireMoreContext(SYSTEM_AND_FRANCHISE_MANAGER_ROLES),
      this.controller.restoreItem,
    );
  }
}
