export interface IUser {
  fname: string;
  lname: string;
  type: "Personal" | "Business";
  email: string;
  phone: string;
  username: string;
  password?: string;
  companyDetails?: {
    companyName: string;
    companyCategory: string;
    companyPhone: string;
    companyWebsite: string;
    companyLocation: string;
    companyState: string;
    companyCity: string;
    companyAddress: string;
  };
  resetPasswordAccess: boolean;
  status: "Active" | "Inactive" | "Suspended" | "Blocked";
  lastSync: string | Date;
  lastUsed: string | Date;
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
