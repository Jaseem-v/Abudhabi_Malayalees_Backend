import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IBusinessAccount } from "../../interfaces";
import { config } from "../../config/index";

const { BUSINESS_ACCOUNTS, CATEGORIES } = config.MONGO_COLLECTIONS;

interface IBusinessAccountDocument extends IBusinessAccount {
  matchPassword(password: string): boolean;
}

const businessAccountSchema = new mongoose.Schema<IBusinessAccountDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: CATEGORIES,
    },
    website: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
      default: "NO ABOUT",
    },
    contactDetails: {
      fname: {
        type: String,
        required: true,
      },
      lname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    resetPasswordAccess: {
      type: Boolean,
      default: false,
      select: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Blocked"],
      default: "Active",
    },
    lastSync: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    lastUsed: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

businessAccountSchema.methods.matchPassword = async function (
  password: string
) {
  return await bcrypt.compare(password, this.password);
};

businessAccountSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password ?? "", salt);
});

export default mongoose.model<IBusinessAccountDocument>(
  BUSINESS_ACCOUNTS,
  businessAccountSchema
);
