import { IImage } from "./default";

export interface IGallery {
  code: string;
  image: IImage;
  visibility: "Show" | "Hide";
  createdAt: string | Date;
  updatedAt: string | Date;
}
