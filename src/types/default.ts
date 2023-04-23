/* Imported Modules */
import { Response, NextFunction } from "express";
import { IAdmin, IRequest } from "../interfaces";
export type IRoles = IAdmin["role"] | "PersonalUser" | "BusinessUser";

/* Custom Types */
export type ApiParams = (
  request: IRequest,
  response: Response,
  next: NextFunction
) => void;

export type LoggerParams = (
  namespace: string,
  message: string,
  additional?: object | string
) => void;
