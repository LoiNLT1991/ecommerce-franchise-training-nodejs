import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpStatus } from "../enums";
import { HttpException } from "../exceptions";
import { IError } from "../interfaces";

const sanitizeEmptyString = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeEmptyString);
  }

  if (typeof obj === "object") {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value === "") {
        result[key] = undefined;
      } else {
        result[key] = sanitizeEmptyString(value);
      }
    }
    return result;
  }

  return obj;
};

const validationMiddleware = (
  type: any,
  skipMissingProperties = false,
  options?: { enableImplicitConversion?: boolean },
): RequestHandler => {
  return async (req, res, next) => {
    const sanitizedBody = sanitizeEmptyString(req.body);

    const dto = plainToInstance(type, sanitizedBody, {
      enableImplicitConversion: options?.enableImplicitConversion ?? true,
    });

    const errors = await validate(dto, { skipMissingProperties });

    if (errors.length > 0) {
      const errorResults: IError[] = [];

      const extractConstraints = (error: ValidationError) => {
        if (error.constraints) {
          Object.values(error.constraints).forEach((message) => {
            errorResults.push({
              message,
              field: error.property,
            });
          });
        }
        error.children?.forEach(extractConstraints);
      };

      errors.forEach(extractConstraints);
      return next(new HttpException(HttpStatus.BadRequest, "", errorResults));
    }

    req.body = dto;
    next();
  };
};

export default validationMiddleware;
