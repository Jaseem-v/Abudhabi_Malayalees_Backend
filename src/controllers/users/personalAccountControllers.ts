import { ErrorResponse } from "../../classes";
import { personalAccountHelpers } from "../../helpers";

import { config } from "../../config";
import { ApiParams } from "../../types";
import { deleteS3File } from "../../functions/s3";

const { NODE_ENV, SERVER_ACCESS_TOKEN_KEY, SERVER_ACCESS_TOKEN_EXPIRE } =
  config.SERVER;

/**
 * Get all personalAccounts
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getPersonalAccounts: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .getPersonalAccounts(
    // req.client!.role
    )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccounts,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get all active personalAccounts
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getVerifiedPersonalAccounts: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .getVerifiedPersonalAccounts(req.query.search ?? "")
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccounts,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular personalAccount
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getPersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .getPersonalAccount(req.params.paid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular personalAccount's profile
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getPersonalAccountProfile: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .getPersonalAccount(req.client!.id)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To login a a personalAccount by email and password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const personalAccountLogin: ApiParams = (req, res, next) => {
  const { username, email, phone, password } = req.body;
  personalAccountHelpers
    .personalAccountLogin(username, email, phone, password)
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
 * To Signup a new personalAccount
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addPersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .addPersonalAccount(
      req.body,
      ["SuperAdmin", "Admin", "Developer"].includes(req.client?.role ?? "")
        ? req.client?.id.toString()
        : undefined
    )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
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
export const sendVerificationMailPersonalAccount: ApiParams = (
  req,
  res,
  next
) => {
  personalAccountHelpers
    .sendVerificationMailPersonalAccount(
      req.body.email,
      req.body.username,
      ["SuperAdmin", "Admin", "Developer"].includes(req.client?.role ?? "")
    )
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
 * To verify account using token
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const verifyPersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .verifyPersonalAccount(req.body.token)
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
 * To edit a personalAccount
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editPersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .editPersonalAccount(req.params.paid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To edit a personalAccount profile
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updatePersonalAccountProfile: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .updatePersonalAccountProfile(req.client!.id, req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * to change a personalAccount profile picture
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changePersonalAccountProfileImage: ApiParams = (
  req,
  res,
  next
) => {
  personalAccountHelpers
    .changePersonalAccountProfileImage(
      ["SuperAdmin", "Admin", "Developer"].includes(req.client?.role ?? "")
        ? req.params.paid
        : req.client!.id,
      req.file
    )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
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
 * To remove a personalAccount profile picture
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const removePersonalAccountProfileImage: ApiParams = (
  req,
  res,
  next
) => {
  personalAccountHelpers
    .removePersonalAccountProfileImage(
      ["SuperAdmin", "Admin", "Developer"].includes(req.client?.role ?? "")
        ? req.params.paid
        : req.client!.id
    )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
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
  personalAccountHelpers
    .addGalleryImage(
      ["SuperAdmin", "Admin", "Developer"].includes(req.client?.role ?? "")
        ? req.params.paid
        : req.client!.id,
      req.file
    )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
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
  personalAccountHelpers
    .removeGalleryImage(
      ["SuperAdmin", "Admin", "Developer"].includes(req.client?.role ?? "")
        ? req.params.paid
        : req.client!.id,
      req.params.gid
    )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
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
  personalAccountHelpers
    .removeAllGalleryImages(
      ["SuperAdmin", "Admin", "Developer"].includes(req.client?.role ?? "")
        ? req.params.paid
        : req.client!.id
    )
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
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
export const forgotPersonalAccountPassword: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .forgotPersonalAccountPassword(req.body.email)
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
 * To change personalAccount password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const resetPersonalAccountPassword: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .resetPersonalAccountPassword(req.body.token, req.body.password)
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
 * To check availablility for personalAccount's username
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const checkPersonalAccountUsernameAvailability: ApiParams = (
  req,
  res,
  next
) => {
  personalAccountHelpers
    .checkPersonalAccountUsernameAvailability(req.body.username)
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
 * To change personalAccount password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changePersonalAccountPassword: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .changePersonalAccountPassword(req.client!.id, req.body)
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
 * To change personalAccount password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changePersonalAccountEmail: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .changePersonalAccountEmail(req.client!.id, req.body.email)
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
 * To change personalAccount phone
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changePersonalAccountPhone: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .changePersonalAccountPhone(req.client!.id, req.body.phone)
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
 * To change a personalAccountname for personalAccount
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changePersonalAccountUsername: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .changePersonalAccountUsername(req.client!.id, req.body.phone)
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
 * To change a status personalAccount  for paticular personalAccount
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changePersonalAccountStatus: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .changePersonalAccountStatus(req.params.paid, req.body.status)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a non deleted personalAccount temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deletePersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .deletePersonalAccount(req.params.paid)
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
 * To restore a deleted personalAccount
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restorePersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .restorePersonalAccount(req.params.paid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.personalAccount,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a personalAccount permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeletePersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .pDeletePersonalAccount(req.params.paid)
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
 * To delete all personalAccount in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllPersonalAccount: ApiParams = (req, res, next) => {
  personalAccountHelpers
    .deleteAllPersonalAccount()
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
