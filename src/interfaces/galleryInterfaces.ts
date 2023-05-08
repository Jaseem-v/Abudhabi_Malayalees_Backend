import { IImage } from "./default";

export interface IGallery {
  code: string;
  image: IImage;
  visibility: "Show" | "Hide";
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
