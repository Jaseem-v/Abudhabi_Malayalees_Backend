import { Document } from "mongoose";
import { IImage } from "./default";

export interface IBusinessAccount {
  name: string;
  username: string;
  phone: string;
  email: string;
  password?: string;
  category: string | Document["_id"];
  website: string;
  location: string;
  state: string;
  city: string;
  address: string;
  about?: string;
  services?: string[];
  images?: IImage[];
  locationType?: string;
  numberOfEmployees?: string;
  socialMediaLinks?: {
    title: "";
    link: "";
  }[];
  yearEstablished?: string;
  contactDetails: {
    fname: string;
    lname: string;
    email: string;
    phone: string;
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
  images?: IImage[];
  socialMediaLinks?: {
    title: "";
    link: "";
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
