import { IImage } from "./default";

export interface IEvent {
  title: string;
  desc: string;
  date: string;
  time: string;
  image: IImage | null;
  eventAt: Date;
  visibility: "Show" | "Hide";
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
