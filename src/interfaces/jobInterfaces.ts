import { IAdmin } from "./adminInterfaces";
import { ICategory } from "./categoryInterfaces";

export interface IJob {
  code: string;
  desc: string;
  category: string | ICategory;
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
