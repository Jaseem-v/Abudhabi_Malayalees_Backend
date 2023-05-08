import mongoose from "mongoose";
import { config } from "../../config/index";
import { News } from "../../models";
import { ThrowError } from "../../classes";
import { IRoles } from "../../types/default";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;

/**
 * To get all news
 * @returns {News} news
 */
export const getNews = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const news = await News.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: "News Fetched",
        news,
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
 * To get a particular news by id
 * @param {String} newsId
 * @returns {News} news
 */
export const getSingleNews = (newsId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId || !isValidObjectId(newsId))
        throw new ThrowError("Provide vaild news id", 404);

      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const news = await News.findOne({ _id: newsId, ...query });

      if (!news) {
        return reject({
          message: "News not found",
          statusCode: 404,
        });
      }
      resolve({ message: "News fetched", news });
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
 * To add a new news
 * @param {News} data
 * @returns news
 */
export const addNews = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { title, body, image, status, visibility } = data;
      if (
        !title ||
        !body ||
        !image ||
        !status ||
        !visibility
      )
        throw new ThrowError(
          "Please Provide title, body, image and visibility",
          400
        );

      const newsExists = await News.findOne({
        title: title,
      });

      if (newsExists)
        throw new ThrowError("News title already exist!", 401);

      const news = await new News({
        code:"",
        title,
        body,
        image: {
          key: image.key,
          mimetype: image.mimetype,
        },
        visibility: "Show",
      });

      const nnews = await news.save();

      resolve({
        message: "News created successfully",
        news: nnews,
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
 * To edit a news
 * @param {String} newsId
 * @param {News} data
 * @returns
 */
export const editNews = (newsId: string, data: any, client: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId || !isValidObjectId(newsId))
        throw new ThrowError("Provide vaild news id", 400);

      const news = await News.findById(newsId);

      if (!news) throw new ThrowError("News not found", 404);

      const { title, image, body, visibility } = data;

      // New title is already exist from another news then
      if (title && news.title != title) {
        const newsExists = await News.findOne({
          title,
        });
        if (newsExists)
          throw new ThrowError("Email already exist for other news", 400);
      }

      // Update a values in db
      news.title = title || news.title;
      news.body = body || news.body;
      news.visibility = visibility || news.visibility;

      if (image && image.key && image.mimetype) {
        // Delete Image
        news.image = {
          key: image.key,
          mimetype: image.mimetype,
        };
      }

      const nnews = await news.save();

      resolve({ message: "News edited successfully", news: nnews });
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
 * To change a visibility for news
 * @param {String} newsId
 * @returns {News} news
 */
export const changeNewsVisibility = (newsId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId || !isValidObjectId(newsId)) {
        return reject({
          message: "Provide vaild news id",
          statusCode: 404,
        });
      }

      const news = await News.findById(newsId);
      if (!news) throw new ThrowError("News not found", 404);

      news.visibility = news.visibility === "Show" ? "Hide" : "Show";

      const nnews = await news.save();

      resolve({
        message: `${nnews.title}'s visibility changed to ${nnews.visibility}`,
        news: nnews,
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
 * To delete a non deleted news temporarily
 * @param {String} newsId
 */
export const deleteNews = (newsId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId || !isValidObjectId(newsId))
        throw new ThrowError("Provide valid news id", 400);

      const news = await News.findOne({
        _id: newsId,
        isDeleted: false,
      });

      if (!news) throw new ThrowError("News not found", 404);

      news.visibility = "Hide";
      news.isDeleted = true;
      news.deletedAt = new Date();

      await news.save();

      resolve({
        message: `${news.title} news was deleted`,
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
 * To restore a deleted news
 * @param {String} newsId
 * @returns news
 */
export const restoreNews = (newsId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId || !isValidObjectId(newsId))
        throw new ThrowError("Provide valid news id", 400);

      const news = await News.findOne({
        _id: newsId,
        isDeleted: true,
      });

      if (!news) {
        return reject({
          message: "News not found",
          statusCode: 404,
        });
      }

      news.visibility = "Show";
      news.isDeleted = false;
      news.deletedAt = undefined;

      const nnews = await news.save();

      resolve({
        message: `${nnews.title} news was restored`,
        news: nnews,
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
 * To delete a news permanently
 * @param {String} newsId
 */
export const pDeleteNews = (newsId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId || !isValidObjectId(newsId))
        throw new ThrowError("Provide valid news id", 400);

      const news = await News.findOne({
        _id: newsId,
        isDeleted: true,
      });

      if (!news) {
        return reject({
          message: "News not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await news.deleteOne();
        return resolve({
          message: `${news.title} news was deleted`,
        });
      }
      throw new ThrowError(
        `Not able to delete news in ${NODE_ENV} mode`,
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
 * To delete all news in development mode
 */
export const deleteAllNews = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await News.deleteMany({});
        return resolve({ message: "All news deleted" });
      }
      throw new ThrowError(
        `Not able to delete all news in ${NODE_ENV} mode`,
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
