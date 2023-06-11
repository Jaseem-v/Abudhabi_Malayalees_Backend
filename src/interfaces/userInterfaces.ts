import { IAdmin } from './adminInterfaces';
import { Document } from "mongoose";
import { IImage, IImages } from "./default";

export interface IBusinessAccount {
  name: string;
  username: string;
  phone: string;
  email: string;
  password?: string;
  category: string | Document["_id"];
  website?: string;
  location?: string;
  about?: string;
  isVerified: boolean;
  verifiedAt: Date;
  verificationMailSentCount: number;
  services: string[];
  gallerys: IImages[];
  profilePicture: IImage | null;
  locationType?: string;
  socialMediaLinks: {
    title: string;
    link: string;
  }[];
  numberOfEmployees: number;
  yearEstablished?: string;
  addressDetails: {
    streetNumber?: string;
    state: string;
    city: string;
    address: string;
    place?: string;
    pincode: string;
    landmark?: string;
  };
  contactDetails: {
    fname: string;
    lname: string;
    phone: string;
    email?: string;
    isAddressVisible?: boolean;
    addressDetails: {
      streetNumber?: string;
      state?: string;
      city?: string;
      address?: string;
      place?: string;
      pincode?: string;
      landmark?: string;
    };
  };
  resetPasswordAccess: boolean;
  status: "Active" | "Inactive" | "Suspended" | "Blocked";
  lastSync: string | Date;
  lastUsed: string | Date;
  manual: boolean;
  createdBy?: string | IAdmin;
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IPersonalAccount {
  fname: string;
  lname: string;
  username: string;
  phone: string;
  email: string;
  password?: string;
  isVerified: boolean;
  verifiedAt: Date;
  verificationMailSentCount: number;
  about: string;
  gallerys: IImages[];
  profilePicture: IImage | null;
  socialMediaLinks?: {
    title: string;
    link: string;
  }[];
  resetPasswordAccess: boolean;
  status: "Active" | "Inactive" | "Suspended" | "Blocked";
  lastSync: string | Date;
  lastUsed: string | Date;
  manual: boolean;
  createdBy?: string | IAdmin;
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}