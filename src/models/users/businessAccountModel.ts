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
    },
    location: {
      type: String,
    },
    about: {
      type: String,
      default: "NO ABOUT",
    },
    socialMediaLinks: [
      {
        title: String,
        link: String,
      },
    ],
    locationType: {
      type: String,
    },
    numberOfEmployees: {
      type: Number,
    },
    yearEstablished: {
      type: String,
    },
    services: [
      {
        type: String,
      },
    ],
    addressDetails: {
      streetNumber: {
        type: String,
      },
      state: {
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
      pincode: {
        type: String,
        required: true,
      },
      place: {
        type: String,
      },
      landmark: {
        type: String,
      },
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
      },
      phone: {
        type: String,
      },
      isAddressVisible: {
        type: Boolean,
        default: false,
      },
      addressDetails: {
        streetNumber: {
          type: String,
        },
        state: {
          type: String,
        },
        city: {
          type: String,
        },
        address: {
          type: String,
        },
        pincode: {
          type: String,
        },
        place: {
          type: String,
        },
        landmark: {
          type: String,
        },
      },
    },
    profilePicture: {
      key: {
        type: String,
      },
      mimetype: {
        type: String,
      },
    },
    gallerys: [
      {
        _id: {
          type: String,
          required: true,
        },
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
