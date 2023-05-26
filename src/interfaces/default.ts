import { Request } from "express";
import { IRoles } from "../types";

export interface IRequest extends Request {
  client?: {
    id: string;
    name: string;
    role: IRoles;
    status: string;
  };
  query: {
    [name: string]: string;
  };
  file?: any;
}

export interface IImage {
  key: string;
  mimetype: string;
}

export interface IImages extends IImage {
  _id: string;
}
