import mongoose from 'mongoose';
import { IAdvertisement } from '../../interfaces';
import { config } from '../../config/index';

const {
  ADVERTISEMENTS,
  ADMINS,
  BUSINESS_ACCOUNTS,
  PERSONAL_ACCOUNTS,
  CATEGORIES,
} = config.MONGO_COLLECTIONS;

const advertisementSchema = new mongoose.Schema<IAdvertisement>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      refPath: 'createdByRole',
    },
    createdByRole: {
      type: String,
      required: true,
      enum: [BUSINESS_ACCOUNTS, PERSONAL_ACCOUNTS, ADMINS],
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: CATEGORIES,
    },
    desc: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['REAL_ESTATE', 'USED_CAR', 'JOB'],
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
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
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
      enum: ['Show', 'Hide'],
      default: 'Show',
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

export default mongoose.model<IAdvertisement>(
  ADVERTISEMENTS,
  advertisementSchema
);
