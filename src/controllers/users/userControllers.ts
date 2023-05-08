import { ErrorResponse } from "../../classes";
import { userHelpers } from "../../helpers";

import { config } from "../../config";
import { ApiParams } from "../../types";

const { NODE_ENV, SERVER_ACCESS_TOKEN_KEY, SERVER_ACCESS_TOKEN_EXPIRE } =
  config.SERVER;

/**
 * Get all users
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getUsers: ApiParams = (req, res, next) => {
  userHelpers
    .getUsers(req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.users,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular user
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getUser: ApiParams = (req, res, next) => {
  userHelpers
    .getUser(req.params.uid,req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.user,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular user's profile
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getUserProfile: ApiParams = (req, res, next) => {
  userHelpers
    .getUser(req.client!.id)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.user,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To login a a user by email and password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const userLogin: ApiParams = (req, res, next) => {
  const { email, phone, password } = req.body;
  userHelpers
    .userLogin(email, phone, password)
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
 * To Signup a new user
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addUser: ApiParams = (req, res, next) => {
  userHelpers
    .addUser(req.body)
    .then((resp: any) => {
      res
        .status(200)
        .json({ success: true, message: resp.message, user: resp.user });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To edit a user
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editUser: ApiParams = (req, res, next) => {
  userHelpers
    .editUser(req.params.uid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.user,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To edit a user profile
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateUserProfile: ApiParams = (req, res, next) => {
  userHelpers
    .updateUserProfile(req.client!.id, req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.user,
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
export const forgotUserPassword: ApiParams = (req, res, next) => {
  userHelpers
    .forgotUserPassword(req.body.email)
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
 * To change user password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const resetUserPassword: ApiParams = (req, res, next) => {
  userHelpers
    .resetUserPassword(req.body.token, req.body.password)
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
 * To change user password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeUserPassword: ApiParams = (req, res, next) => {
  userHelpers
    .changeUserPassword(req.client!.id, req.body)
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
 * To change user password
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeUserEmail: ApiParams = (req, res, next) => {
  userHelpers
    .changeUserEmail(req.client!.id, req.body.email)
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
 * To change user phone
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeUserPhone: ApiParams = (req, res, next) => {
  userHelpers
    .changeUserPhone(req.client!.id, req.body.phone)
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
 * To change a username for user
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeUsername: ApiParams = (req, res, next) => {
  userHelpers
    .changeUsername(req.client!.id, req.body.phone)
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
 * To change a status user  for paticular user
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeUserStatus: ApiParams = (req, res, next) => {
  userHelpers
    .changeUserStatus(req.params.uid, req.body.status)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.user,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a non deleted user temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteUser: ApiParams = (req, res, next) => {
  userHelpers
    .deleteUser(req.params.uid)
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
 * To restore a deleted user
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreUser: ApiParams = (req, res, next) => {
  userHelpers
    .restoreUser(req.params.uid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.user,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a user permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteUser: ApiParams = (req, res, next) => {
  userHelpers
    .pDeleteUser(req.params.uid)
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
 * To delete all user in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllUser: ApiParams = (req, res, next) => {
  userHelpers
    .deleteAllUser()
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
