import { IImage } from "./default";

export interface INews {
  code: string;
  title: string;
  image: IImage;
  body: string;
  visibility: "Show" | "Hide";
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
