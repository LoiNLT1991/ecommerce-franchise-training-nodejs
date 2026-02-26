import { RequestHandler } from "express";
import { HttpStatus } from "../enums";
import { formatResponse } from "../utils";

const requireFranchiseAccess = (): RequestHandler => {
  return async (req, res, next) => {
    const context = req?.user?.context;
    const { franchiseId } = context;
    const requestFranchiseId = req.params.franchiseId || req.body.franchise_id;

    if (!requestFranchiseId) {
      return next();
    }

    if (requestFranchiseId !== franchiseId) {
      return res.status(HttpStatus.Forbidden).json(
        formatResponse({
          message: "You do not have access to this franchise",
        }),
      );
    }

    next();
  };
};

export default requireFranchiseAccess;
