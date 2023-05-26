import { ErrorResponse } from "../../classes";
import { businessAccountHelpers } from "../../helpers";

import { config } from "../../config";
import { ApiParams } from "../../types";
import { deleteS3File } from "../../functions/s3";

const { NODE_ENV, SERVER_ACCESS_TOKEN_KEY, SERVER_ACCESS_TOKEN_EXPIRE } =
  config.SERVER;

/**
 * Get all businessAccounts
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getBusinessAccounts: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .getBusinessAccounts(req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccounts,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular businessAccount
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getBusinessAccount: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .getBusinessAccount(req.params.baid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular businessAccount's profile
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getBusinessAccountProfile: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .getBusinessAccount(req.client!.id)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To login a a businessAccount by email and password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const businessAccountLogin: ApiParams = (req, res, next) => {
  const { username, email, phone, password } = req.body;
  businessAccountHelpers
    .businessAccountLogin(username, email, phone, password)
    .then((resp: any) => {
      res.cookie(SERVER_ACCESS_TOKEN_KEY, resp.token, {
        secure: NODE_ENV.toLocaleLowerCase() === "personalAccountion",
        httpOnly: true,
        expires: new Date(
          new Date().getTime() + parseInt(SERVER_ACCESS_TOKEN_EXPIRE)
        ),
      });
      res.status(200).json({
        success: true,
        message: resp.message,
        token: resp.token,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To Signup a new businessAccount
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addBusinessAccount: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .addBusinessAccount(req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        businessAccount: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To edit a businessAccount
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editBusinessAccount: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .editBusinessAccount(req.params.baid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To edit a businessAccount profile
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateBusinessAccountProfile: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .updateBusinessAccountProfile(req.client!.id, req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * to change a businessAccount profile picture
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeBusinessAccountProfileImage: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .changeBusinessAccountProfileImage(req.client!.id, req.file)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
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
 * To remove a businessAccount profile picture
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const removeBusinessAccountProfileImage: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .removeBusinessAccountProfileImage(req.client!.id)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * Add a new personalAccount image
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addGalleryImage: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .addGalleryImage(req.client!.id, req.file)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
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
 * Remove a personalAccount image
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const removeGalleryImage: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .removeGalleryImage(req.client!.id, req.params.gid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
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
 * Remove all image from a personalAccount
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const removeAllGalleryImages: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .removeAllGalleryImages(req.client!.id)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To send a reset link to email
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const forgotBusinessAccountPassword: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .forgotBusinessAccountPassword(req.body.email)
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
 * To change businessAccount password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const resetBusinessAccountPassword: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .resetBusinessAccountPassword(req.body.token, req.body.password)
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
 * To check availablility for businessAccount's username
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const checkBusinessAccountUsernameAvailability: ApiParams = (
  req,
  res,
  next
) => {
  businessAccountHelpers
    .checkBusinessAccountUsernameAvailability(req.body.username)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        availability: resp.availability,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To change businessAccount password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeBusinessAccountPassword: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .changeBusinessAccountPassword(req.client!.id, req.body)
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
 * To change businessAccount password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeBusinessAccountEmail: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .changeBusinessAccountEmail(req.client!.id, req.body.email)
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
 * To change businessAccount phone
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeBusinessAccountPhone: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .changeBusinessAccountPhone(req.client!.id, req.body.phone)
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
 * To change a businessAccount's Username
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeBusinessAccountUsername: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .changeBusinessAccountUsername(req.client!.id, req.body.phone)
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
 * To change a status businessAccount  for paticular businessAccount
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeBusinessAccountStatus: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .changeBusinessAccountStatus(req.params.baid, req.body.status)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a non deleted businessAccount temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteBusinessAccount: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .deleteBusinessAccount(req.params.baid)
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
 * To restore a deleted businessAccount
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreBusinessAccount: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .restoreBusinessAccount(req.params.baid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.businessAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a businessAccount permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteBusinessAccount: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .pDeleteBusinessAccount(req.params.baid)
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
 * To delete all businessAccount in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllBusinessAccount: ApiParams = (req, res, next) => {
  businessAccountHelpers
    .deleteAllBusinessAccount()
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
