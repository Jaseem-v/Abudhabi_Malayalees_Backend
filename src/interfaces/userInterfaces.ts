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
  isDeleted: boolean;
  deletedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IUser {
  fname: string;
  lname: string;
  type: "PersonalAccount" | "BusinessAccount";
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
