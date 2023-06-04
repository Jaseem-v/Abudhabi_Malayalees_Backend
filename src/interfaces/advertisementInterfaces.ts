import { IAdmin } from "./adminInterfaces";
import { IImage } from "./default";

export interface IAdvertisement {
  code: string;
  desc: string;
  image: IImage | null;
  type: "REAL_ESTATE" | "USED_CAR";
  visibility: "Show" | "Hide";
  status: "PENDING" | "APPROVED" | "REJECTED";
  statusLog: {
    approvedAt: Date;
    approvedBy: string | IAdmin;
    rejectedAt: Date;
    rejectedBy: string | IAdmin;
  };
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
