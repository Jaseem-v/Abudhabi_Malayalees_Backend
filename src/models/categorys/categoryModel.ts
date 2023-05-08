import mongoose from "mongoose";
import { ICategory } from "../../interfaces";
import { config } from "../../config/index";

const { CATEGORIES } = config.MONGO_COLLECTIONS;

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["JOB", "BUSINESS"],
      required: true,
    },
    image: {
      key: {
        type: String,
        required: true,
      },
      mimetype: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    visibility: {
      type: String,
      enum: ["Show", "Hide"],
      default: "Show",
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

export default mongoose.model<ICategory>(CATEGORIES, categorySchema);
