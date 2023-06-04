import mongoose from "mongoose";
import { IGallery } from "../../interfaces";
import { config } from "../../config/index";

const { GALLERYS } = config.MONGO_COLLECTIONS;

const gallerySchema = new mongoose.Schema<IGallery>(
  {
    code: {
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
    visibility: {
      type: String,
      enum: ["Show", "Hide"],
      default: "Show",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGallery>(GALLERYS, gallerySchema);
