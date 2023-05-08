import mongoose from "mongoose";
import { config } from "../../config/index";
import { Category } from "../../models";
import { ThrowError } from "../../classes";
import { IRoles } from "../../types/default";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;

/**
 * To get all categorys
 * @returns {Categories} categorys
 */
export const getCategories = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const categorys = await Category.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: "Categories Fetched",
        categorys,
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
 * To get a particular category by id
 * @param {String} categoryId
 * @returns {Category} category
 */
export const getCategory = (categoryId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId || !isValidObjectId(categoryId))
        throw new ThrowError("Provide vaild category id", 404);

      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const category = await Category.findOne({ _id: categoryId, ...query });

      if (!category) {
        return reject({
          message: "Category not found",
          statusCode: 404,
        });
      }
      resolve({ message: "Category fetched", category });
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
 * To add a new category
 * @param {Category} data
 * @returns category
 */
export const addCategory = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, type, image, status, visibility } = data;
      if (
        !name ||
        !type ||
        ["JOB", "BUSINESS"].includes(type) ||
        !image ||
        !status ||
        !visibility
      )
        throw new ThrowError(
          "Please Provide name, type('JOB', 'BUSINESS') and image",
          400
        );

      const categoryExists = await Category.findOne({
        name: name,
      });

      if (categoryExists)
        throw new ThrowError("Category name already exist!", 401);

      const category = await new Category({
        name,
        image: {
          key: image.key,
          mimetype: image.mimetype,
        },
        status: "Active",
        visibility: "Show",
      });

      const ncategory = await category.save();

      resolve({
        message: "Category created successfully",
        category: ncategory,
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
 * To edit a category
 * @param {String} categoryId
 * @param {Category} data
 * @returns
 */
export const editCategory = (categoryId: string, data: any, client: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId || !isValidObjectId(categoryId))
        throw new ThrowError("Provide vaild category id", 400);

      const category = await Category.findById(categoryId);

      if (!category) throw new ThrowError("Category not found", 404);

      const { name, image, status, visibility } = data;

      // New name is already exist from another category then
      if (name && category.name != name) {
        const categoryExists = await Category.findOne({
          name,
        });
        if (categoryExists)
          throw new ThrowError("Email already exist for other category", 400);
      }

      // Update a values in db
      category.name = name || category.name;
      category.status = status || category.status;
      category.visibility = visibility || category.visibility;

      if (image && image.key && image.mimetype) {
        // Delete Image
        category.image = {
          key: image.key,
          mimetype: image.mimetype,
        };
      }

      const ncategory = await category.save();

      resolve({ message: "Category edited successfully", category: ncategory });
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
 * To change a status for category
 * @param {String} categoryId
 * @returns {Category} category
 */
export const changeCategoryStatus = (categoryId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId || !isValidObjectId(categoryId)) {
        return reject({
          message: "Provide vaild category id",
          statusCode: 404,
        });
      }

      const category = await Category.findById(categoryId);
      if (!category) throw new ThrowError("Category not found", 404);

      category.status = category.status === "Active" ? "Inactive" : "Active";

      const ncategory = await category.save();

      resolve({
        message: `${ncategory.name}'s status changed to ${ncategory.status}`,
        category: ncategory,
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
 * To change a visibility for category
 * @param {String} categoryId
 * @returns {Category} category
 */
export const changeCategoryVisibility = (categoryId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId || !isValidObjectId(categoryId)) {
        return reject({
          message: "Provide vaild category id",
          statusCode: 404,
        });
      }

      const category = await Category.findById(categoryId);
      if (!category) throw new ThrowError("Category not found", 404);

      category.visibility = category.visibility === "Show" ? "Hide" : "Show";

      const ncategory = await category.save();

      resolve({
        message: `${ncategory.name}'s visibility changed to ${ncategory.visibility}`,
        category: ncategory,
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
 * To delete a non deleted category temporarily
 * @param {String} categoryId
 */
export const deleteCategory = (categoryId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId || !isValidObjectId(categoryId))
        throw new ThrowError("Provide valid category id", 400);

      const category = await Category.findOne({
        _id: categoryId,
        isDeleted: false,
      });

      if (!category) throw new ThrowError("Category not found", 404);

      category.status = "Inactive";
      category.isDeleted = true;
      category.deletedAt = new Date();

      await category.save();

      resolve({
        message: `${category.name} category was deleted`,
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
 * To restore a deleted category
 * @param {String} categoryId
 * @returns category
 */
export const restoreCategory = (categoryId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId || !isValidObjectId(categoryId))
        throw new ThrowError("Provide valid category id", 400);

      const category = await Category.findOne({
        _id: categoryId,
        isDeleted: true,
      });

      if (!category) {
        return reject({
          message: "Category not found",
          statusCode: 404,
        });
      }

      category.status = "Active";
      category.isDeleted = false;
      category.deletedAt = undefined;

      const ncategory = await category.save();

      resolve({
        message: `${ncategory.name} category was restored`,
        category: ncategory,
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
 * To delete a category permanently
 * @param {String} categoryId
 */
export const pDeleteCategory = (categoryId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId || !isValidObjectId(categoryId))
        throw new ThrowError("Provide valid category id", 400);

      const category = await Category.findOne({
        _id: categoryId,
        isDeleted: true,
      });

      if (!category) {
        return reject({
          message: "Category not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await category.deleteOne();
        return resolve({
          message: `${category.name} category was deleted`,
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
 * To delete all category in development mode
 */
export const deleteAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await Category.deleteMany({});
        return resolve({ message: "All category deleted" });
      }
      throw new ThrowError(
        `Not able to delete all categorys in ${NODE_ENV} mode`,
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
