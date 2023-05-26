import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IPersonalAccount } from "../../interfaces";
import { config } from "../../config/index";

const { PERSONAL_ACCOUNTS } = config.MONGO_COLLECTIONS;

interface IPersonalAccountDocument extends IPersonalAccount {
  matchPassword(password: string): boolean;
}

const personalAccountSchema = new mongoose.Schema<IPersonalAccountDocument>(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
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
    about: {
      type: String,
      required: true,
      default: "NO ABOUT",
    },
    socialMediaLinks: [
      {
        title: String,
        link: String,
      },
    ],
    gallerys: [
      {
        key: {
          type: String,
          required: true,
        },
        mimetype: {
          type: String,
          required: true,
        },
      },
    ],
    profilePicture: {
      key: {
        type: String,
      },
      mimetype: {
        type: String,
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

personalAccountSchema.methods.matchPassword = async function (
  password: string
) {
  return await bcrypt.compare(password, this.password);
};

personalAccountSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password ?? "", salt);
});

export default mongoose.model<IPersonalAccountDocument>(
  PERSONAL_ACCOUNTS,
  personalAccountSchema
);
