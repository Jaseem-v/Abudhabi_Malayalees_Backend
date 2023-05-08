import { ErrorResponse } from "../../classes";
import { adminHelpers } from "../../helpers";

import { config } from "../../config";
import { ApiParams } from "../../types";

const { NODE_ENV, SERVER_ACCESS_TOKEN_KEY, SERVER_ACCESS_TOKEN_EXPIRE } =
  config.SERVER;

/**
 * Get all admins
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAdmins: ApiParams = (req, res, next) => {
  adminHelpers
    .getAdmins(req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.admins,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular admin
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAdmin: ApiParams = (req, res, next) => {
  adminHelpers
    .getAdmin(req.params.aid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.admin,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular admin's profile
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAdminProfile: ApiParams = (req, res, next) => {
  adminHelpers
    .getAdmin(req.client!.id)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.admin,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To login a a admin by email and password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const adminLogin: ApiParams = (req, res, next) => {
  const { email, phone, password } = req.body;
  adminHelpers
    .adminLogin(email, phone, password)
    .then((resp: any) => {
      res.cookie(SERVER_ACCESS_TOKEN_KEY, resp.token, {
        secure: NODE_ENV.toLocaleLowerCase() === "production",
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
 * To Signup a new admin
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addAdmin: ApiParams = (req, res, next) => {
  adminHelpers
    .addAdmin(req.body)
    .then((resp: any) => {
      res
        .status(200)
        .json({ success: true, message: resp.message, admin: resp.admin });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To edit a admin
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editAdmin: ApiParams = (req, res, next) => {
  adminHelpers
    .editAdmin(req.params.aid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.admin,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To edit a admin profile
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateAdminProfile: ApiParams = (req, res, next) => {
  adminHelpers
    .updateAdminProfile(req.client!.id, req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.admin,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To send a reset link to email
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const forgotAdminPassword: ApiParams = (req, res, next) => {
  adminHelpers
    .forgotAdminPassword(req.body.email)
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
 * To change admin password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const resetAdminPassword: ApiParams = (req, res, next) => {
  adminHelpers
    .resetAdminPassword(req.body.token, req.body.password)
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
 * To change admin password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeAdminPassword: ApiParams = (req, res, next) => {
  adminHelpers
    .changeAdminPassword(req.client!.id, req.body)
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
 * To change admin password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeAdminEmail: ApiParams = (req, res, next) => {
  adminHelpers
    .changeAdminEmail(req.client!.id, req.body.email)
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
 * To change admin phone
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeAdminPhone: ApiParams = (req, res, next) => {
  adminHelpers
    .changeAdminPhone(req.client!.id, req.body.phone)
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
 * To send a verify code to admin email
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const sentLoginCredentials: ApiParams = (req, res, next) => {
  adminHelpers
    .sentLoginCredentials(req.params.aid)
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
 * To change a status admin  for paticular admin
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeAdminStatus: ApiParams = (req, res, next) => {
  adminHelpers
    .changeAdminStatus(req.params.aid, req.body.status)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.admin,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a non deleted admin temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAdmin: ApiParams = (req, res, next) => {
  adminHelpers
    .deleteAdmin(req.params.aid)
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
 * To restore a deleted admin
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreAdmin: ApiParams = (req, res, next) => {
  adminHelpers
    .restoreAdmin(req.params.aid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.admin,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a admin permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteAdmin: ApiParams = (req, res, next) => {
  adminHelpers
    .pDeleteAdmin(req.params.aid)
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
 * To delete all admin in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllAdmin: ApiParams = (req, res, next) => {
  adminHelpers
    .deleteAllAdmin()
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
