import { IAdmin } from "./adminInterfaces";
import { IImage } from "./default";
import { IPersonalAccount, IBusinessAccount } from "./userInterfaces";

export interface IAdvertisement {
  code: string;
  user: IPersonalAccount | IBusinessAccount | string;
  userRole: string ;
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
