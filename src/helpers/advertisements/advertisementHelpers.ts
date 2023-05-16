import mongoose from "mongoose";
import { config } from "../../config/index";
import { Advertisement } from "../../models";
import { ThrowError } from "../../classes";
import { IRoles } from "../../types/default";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;

/**
 * To get all advertisements
 * @returns {Advertisements} advertisements
 */
export const getAdvertisements = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const advertisements = await Advertisement.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: "Advertisements Fetched",
        advertisements,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To get a particular advertisement by id
 * @param {String} advertisementId
 * @returns {Advertisement} advertisement
 */
export const getAdvertisement = (advertisementId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError("Provide vaild advertisement id", 404);

      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        ...query,
      });

      if (!advertisement) {
        return reject({
          message: "Advertisement not found",
          statusCode: 404,
        });
      }
      resolve({ message: "Advertisement fetched", advertisement });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To add a new advertisement
 * @param {Advertisement} data
 * @returns advertisement
 */
export const addAdvertisement = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { desc, type, image, visibility } = data;
      if (
        !desc ||
        !image ||
        !type ||
        !["REAL_ESTATE", "USED_CAR"].includes(type) ||
        !visibility
      )
        throw new ThrowError(
          "Please Provide  desc, type('REAL_ESTATE', 'USED_CAR') and visibility",
          400
        );

      const advertisement = await new Advertisement({
        code: "",
        desc,
        image: {
          key: image.key.split("/").slice(-1)[0],
          mimetype: image.mimetype,
        },
        type: type,
        status: "PENDING",
        visibility: "Show",
      });

      const nadvertisement = await advertisement.save();

      resolve({
        message: "Advertisement created successfully",
        advertisement: nadvertisement,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To edit a advertisement
 * @param {String} advertisementId
 * @param {Advertisement} data
 * @returns
 */
export const editAdvertisement = (
  advertisementId: string,
  data: any,
  client: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError("Provide vaild advertisement id", 400);

      const advertisement = await Advertisement.findById(advertisementId);

      if (!advertisement) throw new ThrowError("Advertisement not found", 404);

      const { image, desc, visibility } = data;

      // Update a values in db
      advertisement.desc = desc || advertisement.desc;
      advertisement.visibility = visibility || advertisement.visibility;

      if (image && image.key && image.mimetype) {
        // Delete Image
        advertisement.image = {
          key: image.key.split("/").slice(-1)[0],
          mimetype: image.mimetype,
        };
      }

      const nadvertisement = await advertisement.save();

      resolve({
        message: "Advertisement edited successfully",
        advertisement: nadvertisement,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To change a status for advertisement
 * @param {String} advertisementId
 * @returns {Advertisement} advertisement
 */
export const changeAdvertisementStatus = (
  advertisementId: string,
  status: "APPROVE" | "REJECT",
  clientId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !advertisementId ||
        !isValidObjectId(advertisementId) ||
        status ||
        !["APPROVE", "REJECT"].includes(status)
      ) {
        return reject({
          message:
            "Provide vaild advertisement id and status ('APPROVE', 'REJECT')",
          statusCode: 404,
        });
      }

      const advertisement = await Advertisement.findById(advertisementId);
      if (
        !advertisement ||
        (advertisement.status === "APPROVED" && status === "APPROVE") ||
        (advertisement.status === "REJECTED" && status === "REJECT")
      )
        throw new ThrowError(
          !advertisement
            ? "Advertisement not found"
            : advertisement.status === "APPROVED" && status === "APPROVE"
            ? "Advertisement already approved"
            : "Advertisement already rejected",
          404
        );

      advertisement.status = status === "APPROVE" ? "APPROVED" : "REJECTED";

      if (status === "APPROVE") {
        advertisement.statusLog.approvedAt = new Date();
        advertisement.statusLog.approvedBy = clientId;
      } else {
        advertisement.statusLog.rejectedAt = new Date();
        advertisement.statusLog.rejectedBy = clientId;
      }

      const nadvertisement = await advertisement.save();

      resolve({
        message: `${nadvertisement.code}'s status changed to ${nadvertisement.status}`,
        advertisement: nadvertisement,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To change a visibility for advertisement
 * @param {String} advertisementId
 * @returns {Advertisement} advertisement
 */
export const changeAdvertisementVisibility = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId)) {
        return reject({
          message: "Provide vaild advertisement id",
          statusCode: 404,
        });
      }

      const advertisement = await Advertisement.findById(advertisementId);
      if (!advertisement) throw new ThrowError("Advertisement not found", 404);

      advertisement.visibility =
        advertisement.visibility === "Show" ? "Hide" : "Show";

      const nadvertisement = await advertisement.save();

      resolve({
        message: `${nadvertisement.code}'s visibility changed to ${nadvertisement.visibility}`,
        advertisement: nadvertisement,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete a non deleted advertisement temporarily
 * @param {String} advertisementId
 */
export const deleteAdvertisement = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError("Provide valid advertisement id", 400);

      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        isDeleted: false,
      });

      if (!advertisement) throw new ThrowError("Advertisement not found", 404);

      advertisement.visibility = "Show";
      advertisement.isDeleted = true;
      advertisement.deletedAt = new Date();

      await advertisement.save();

      resolve({
        message: `${advertisement.code} advertisement was deleted`,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To restore a deleted advertisement
 * @param {String} advertisementId
 * @returns advertisement
 */
export const restoreAdvertisement = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError("Provide valid advertisement id", 400);

      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        isDeleted: true,
      });

      if (!advertisement) {
        return reject({
          message: "Advertisement not found",
          statusCode: 404,
        });
      }

      advertisement.visibility = "Show";
      advertisement.isDeleted = false;
      advertisement.deletedAt = undefined;

      const nadvertisement = await advertisement.save();

      resolve({
        message: `${nadvertisement.code} advertisement was restored`,
        advertisement: nadvertisement,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete a advertisement permanently
 * @param {String} advertisementId
 */
export const pDeleteAdvertisement = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError("Provide valid advertisement id", 400);

      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        isDeleted: true,
      });

      if (!advertisement) {
        return reject({
          message: "Advertisement not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await advertisement.deleteOne();
        return resolve({
          message: `${advertisement.code} category was deleted`,
        });
      }
      throw new ThrowError(
        `Not able to delete category in ${NODE_ENV} mode`,
        401
      );
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete all advertisement in development mode
 */
export const deleteAllAdvertisement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await Advertisement.deleteMany({});
        return resolve({ message: "All advertisement deleted" });
      }
      throw new ThrowError(
        `Not able to delete all advertisements in ${NODE_ENV} mode`,
        401
      );
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};
