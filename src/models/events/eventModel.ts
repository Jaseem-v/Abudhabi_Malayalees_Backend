import mongoose from "mongoose";
import { IEvent } from "../../interfaces";
import { config } from "../../config/index";

const { EVENTS } = config.MONGO_COLLECTIONS;

const eventSchema = new mongoose.Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    image: {
      key: {
        type: String,
      },
      mimetype: {
        type: String,
      },
    },
    eventAt: {
      type: Date,
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

export default mongoose.model<IEvent>(EVENTS, eventSchema);
