import { IAdmin } from './adminInterfaces';
import { ICategory } from './categoryInterfaces';
import { IImage } from './default';
import { IPersonalAccount, IBusinessAccount } from './userInterfaces';

export interface IAdvertisement {
  code: string;
  createdBY: IPersonalAccount | IBusinessAccount | IAdmin | string;
  createdBYRole: string;
  category?: string | ICategory;
  desc: string;
  image: IImage | null;
  type: 'REAL_ESTATE' | 'USED_CAR';
  visibility: 'Show' | 'Hide';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
