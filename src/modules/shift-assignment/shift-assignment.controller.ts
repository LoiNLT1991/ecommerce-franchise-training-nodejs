import { AuthenticatedUserRequest, BaseCrudController, formatResponse, HttpException, HttpStatus, MSG_BUSINESS } from "../../core";
import { IShiftAssignment } from "./shift-assignment.interface";
import { CreateShiftAssignmentDto } from "./dto/create.dto";
import { UpdateShiftAssignmentDto } from "./dto/update.dto";
import { SearchPaginationItemDto } from "./dto/search.dto";
import { ShiftAssignmentService } from "./shift-assignment.service";
import { mapItemToResponse } from "./shift-assignment.mapper";
import { ShiftAssignmentItemDto } from "./dto/item.dto";
import { NextFunction, Request, Response } from "express";

export class ShiftAssignmentController extends BaseCrudController<IShiftAssignment,
CreateShiftAssignmentDto,
UpdateShiftAssignmentDto,
SearchPaginationItemDto,
ShiftAssignmentItemDto,
ShiftAssignmentService> {
  constructor(service: ShiftAssignmentService) {
    super(service,mapItemToResponse)
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item) {
        throw new HttpException(HttpStatus.NotFound, MSG_BUSINESS.ITEM_NOT_FOUND);
      }
      res.status(HttpStatus.Success).json(formatResponse(mapItemToResponse(item)));
    } catch (error) {
      next(error);
    }
  }
  public changeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await this.service.changeStatus(id, status, (req as AuthenticatedUserRequest).user?.id || '');

      res.status(HttpStatus.Success).json(formatResponse<null>(null));
    } catch (error) {
      next(error);
    }
  }
}
