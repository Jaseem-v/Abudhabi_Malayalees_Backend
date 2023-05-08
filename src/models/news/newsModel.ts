import mongoose from "mongoose";
import { INews } from "../../interfaces";
import { config } from "../../config/index";

const { NEWS } = config.MONGO_COLLECTIONS;

const newsSchema = new mongoose.Schema<INews>(
  {
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
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
    body: {
      type: String,
      required: true,
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

export default mongoose.model<INews>(NEWS, newsSchema);
