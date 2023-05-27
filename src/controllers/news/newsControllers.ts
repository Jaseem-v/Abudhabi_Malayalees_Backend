import { ErrorResponse } from "../../classes";
import { deleteS3File } from "../../functions/s3";
import { newsHelpers } from "../../helpers";

import { ApiParams } from "../../types";

/**
 * Get all news
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getNews: ApiParams = (req, res, next) => {
  newsHelpers
    .getNews(req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.news,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular news
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getSingleNews: ApiParams = (req, res, next) => {
  newsHelpers
    .getSingleNews(req.params.nid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.news,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To Signup a new news
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addNews: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  newsHelpers
    .addNews(req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        news: resp.news,
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
 * To edit a news
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editNews: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  newsHelpers
    .editNews(req.params.nid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.news,
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
 * To change news visibility
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeNewsVisibility: ApiParams = (req, res, next) => {
  newsHelpers
    .changeNewsVisibility(req.params.nid)
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
 * To delete a non deleted news temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteNews: ApiParams = (req, res, next) => {
  newsHelpers
    .deleteNews(req.params.nid)
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
 * To restore a deleted news
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreNews: ApiParams = (req, res, next) => {
  newsHelpers
    .restoreNews(req.params.nid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.news,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a news permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteNews: ApiParams = (req, res, next) => {
  newsHelpers
    .pDeleteNews(req.params.nid)
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
 * To delete all news in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllNews: ApiParams = (req, res, next) => {
  newsHelpers
    .deleteAllNews()
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
