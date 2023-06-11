import mongoose from "mongoose";
import { config } from "../../config/index";
import { Gallery } from "../../models";
import { ThrowError } from "../../classes";
import { IRoles } from "../../types/default";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;

/**
 * To get all gallerys
 * @returns {Gallerys} gallerys
 */
export const getGallerys = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gallerys = await Gallery.find({}).sort({
        createdAt: -1,
      });

      resolve({
        message: "Gallerys Fetched",
        gallerys,
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
 * To get all gallerys
 * @returns {Gallerys} gallerys
 */
export const getGallerysForCustomer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gallerys = await Gallery.find({
        visibility: "Show",
      }).sort({
        createdAt: -1,
      });

      resolve({
        message: "Gallerys Fetched",
        gallerys,
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
 * To get a particular gallery by id
 * @param {String} galleryId
 * @returns {Gallery} gallery
 */
export const getGallery = (galleryId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!galleryId || !isValidObjectId(galleryId))
        throw new ThrowError("Provide vaild gallery id", 404);

      const gallery = await Gallery.findOne({ _id: galleryId });

      if (!gallery) {
        return reject({
          message: "Gallery not found",
          statusCode: 404,
        });
      }
      resolve({ message: "Gallery fetched", gallery });
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
 * To add a new gallery
 * @param {Gallery} data
 * @returns gallery
 */
export const addGallery = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { image, visibility } = data;
      if (!image)
        throw new ThrowError("Please Provide image and visibility", 400);

      const lastCode = await Gallery.find({}, { code: 1, _id: 0 })
        .limit(1)
        .sort({ createdAt: -1 });
      data.code =
        lastCode.length === 1
          ? "GLY" + (parseInt(lastCode[0].code.slice(3)) + 1)
          : "GLY100";

      const gallery = await new Gallery({
        code: data.code,
        image: {
          key: image.key.split("/").slice(-1)[0],
          mimetype: image.mimetype,
        },
        visibility: visibility || "Show",
      });

      const ngallery = await gallery.save();

      resolve({
        message: "Gallery created successfully",
        gallery: ngallery,
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
 * To edit a gallery
 * @param {String} galleryId
 * @param {Gallery} data
 * @returns
 */
export const editGallery = (galleryId: string, data: any, client: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!galleryId || !isValidObjectId(galleryId))
        throw new ThrowError("Provide vaild gallery id", 400);

      const gallery = await Gallery.findById(galleryId);

      if (!gallery) throw new ThrowError("Gallery not found", 404);

      const { image, visibility } = data;

      // Update a values in db
      gallery.visibility = visibility || gallery.visibility;

      if (image && image.key && image.mimetype) {
        // Delete Image
        gallery.image = {
          key: image.key.split("/").slice(-1)[0],
          mimetype: image.mimetype,
        };
      }

      const ngallery = await gallery.save();

      resolve({ message: "Gallery edited successfully", gallery: ngallery });
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
 * To change a visibility for gallery
 * @param {String} galleryId
 * @returns {Gallery} gallery
 */
export const changeGalleryVisibility = (galleryId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!galleryId || !isValidObjectId(galleryId)) {
        return reject({
          message: "Provide vaild gallery id",
          statusCode: 404,
        });
      }

      const gallery = await Gallery.findById(galleryId);
      if (!gallery) throw new ThrowError("Gallery not found", 404);

      gallery.visibility = gallery.visibility === "Show" ? "Hide" : "Show";

      const ngallery = await gallery.save();

      resolve({
        message: `${ngallery.code}'s visibility changed to ${ngallery.visibility}`,
        gallery: ngallery,
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
 * To delete a gallery
 * @param {String} galleryId
 */
export const deleteGallery = (galleryId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!galleryId || !isValidObjectId(galleryId))
        throw new ThrowError("Provide valid gallery id", 400);

      const gallery = await Gallery.findById(galleryId);

      if (!gallery) {
        return reject({
          message: "Gallery not found",
          statusCode: 404,
        });
      }

      await gallery.deleteOne();
      return resolve({
        message: `${gallery.code} gallery was deleted`,
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
 * To delete all gallery
 */
export const deleteAllGallery = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await Gallery.deleteMany({});
      return resolve({ message: "All gallery deleted" });
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};
