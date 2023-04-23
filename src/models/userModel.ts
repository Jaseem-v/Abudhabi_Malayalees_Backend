import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces";
import { config } from "../config/index.js";

const { USERS, CATEGORIES } = config.MONGO_COLLECTIONS;

interface IUserDocument extends IUser {
  matchPassword(password: string): boolean;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Personal", "Business"],
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
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    companyDetails: {
      name: {
        type: String,
        required: true,
      },
      category: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: CATEGORIES,
      },
      phone: {
        type: String,
        required: true,
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

userSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password ?? "", salt);
});

export default mongoose.model<IUserDocument>(USERS, userSchema);
