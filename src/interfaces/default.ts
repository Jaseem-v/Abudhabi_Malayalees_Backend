import { Request } from "express";
import { IRoles } from "../types";

export interface IRequest extends Request {
  client?: {
    id: string;
    name: string;
    role: IRoles;
  };
  query: {
    [name: string]: string;
  };
}

export interface IImage {
  key: string;
  mimetype: string;
}
