import mongoose from "mongoose";
import { IJob } from "../../interfaces";
import { config } from "../../config/index";

const { JOBS, CATEGORIES, ADMINS } = config.MONGO_COLLECTIONS;

const jobSchema = new mongoose.Schema<IJob>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: CATEGORIES,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      required: true,
    },
    statusLog: {
      approvedAt: Date,
      approvedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: ADMINS,
      },
      rejectedAt: Date,
      rejectedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: ADMINS,
      },
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

export default mongoose.model<IJob>(JOBS, jobSchema);
