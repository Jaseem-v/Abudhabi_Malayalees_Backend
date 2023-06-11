import { ErrorResponse } from "../../classes";
import { deleteS3File } from "../../functions/s3";
import { categoryHelpers } from "../../helpers";

import { ApiParams } from "../../types";

/**
 * Get all categorys
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getCategories: ApiParams = (req, res, next) => {
  categoryHelpers
    .getCategories(
      // req.client!.role
      )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.categorys,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get all categorys by job
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getCategorysByJob: ApiParams = (req, res, next) => {
  categoryHelpers
    .getCategorysByType("JOB", req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.categorys,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get all categorys by business
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getCategorysByBusiness: ApiParams = (req, res, next) => {
  categoryHelpers
    .getCategorysByType("BUSINESS", req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.categorys,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};


/**
 * Get a particular category
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getCategory: ApiParams = (req, res, next) => {
  categoryHelpers
    .getCategory(req.params.cid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.category,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To Signup a new category
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addCategory: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  categoryHelpers
    .addCategory(req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.category,
      });
    })
    .catch((error: any) => {
      if (req.file) {
        deleteS3File(req.file.key);
      }
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To edit a category
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editCategory: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  categoryHelpers
    .editCategory(req.params.cid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.category,
      });
    })
    .catch((error: any) => {
      if (req.file) {
        deleteS3File(req.file.key);
      }
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To change category status
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeCategoryStatus: ApiParams = (req, res, next) => {
  categoryHelpers
    .changeCategoryStatus(req.params.cid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To change category visibility
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeCategoryVisibility: ApiParams = (req, res, next) => {
  categoryHelpers
    .changeCategoryVisibility(req.params.cid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To delete a non deleted category temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteCategory: ApiParams = (req, res, next) => {
  categoryHelpers
    .deleteCategory(req.params.cid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To restore a deleted category
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreCategory: ApiParams = (req, res, next) => {
  categoryHelpers
    .restoreCategory(req.params.cid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.category,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a category permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteCategory: ApiParams = (req, res, next) => {
  categoryHelpers
    .pDeleteCategory(req.params.cid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete all category in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllCategory: ApiParams = (req, res, next) => {
  categoryHelpers
    .deleteAllCategory()
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};
