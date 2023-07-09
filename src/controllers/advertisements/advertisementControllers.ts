import { ErrorResponse } from '../../classes';
import { deleteS3File } from '../../functions/s3';
import { advertisementHelpers } from '../../helpers';

import { ApiParams } from '../../types';

/**
 * Get all advertisements
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAdvertisements: ApiParams = (req, res, next) => {
  advertisementHelpers
    .getAdvertisements
    // req.client!.role
    ()
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.advertisements,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get all advertisements by real estate
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAdvertisementsByRealEstate: ApiParams = (req, res, next) => {
  advertisementHelpers
    .getAdvertisementsByType('REAL_ESTATE', req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.advertisements,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get all advertisements by used car
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAdvertisementsByUserCar: ApiParams = (req, res, next) => {
  advertisementHelpers
    .getAdvertisementsByType('USED_CAR', req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.advertisements,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular advertisement
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAdvertisement: ApiParams = (req, res, next) => {
  advertisementHelpers
    .getAdvertisement(req.params.aid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.advertisement,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To Signup a new advertisement
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addAdvertisement: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  advertisementHelpers
    .addAdvertisement(req.client!.id, req.client!.role, req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        advertisement: resp.advertisement,
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
 * To edit a advertisement
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editAdvertisement: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  advertisementHelpers
    .editAdvertisement(req.params.aid, req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.advertisement,
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
 * To change advertisement status
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeAdvertisementStatus: ApiParams = (req, res, next) => {
  advertisementHelpers
    .changeAdvertisementStatus(req.params.aid, req.body.status, req.client?.id!)
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
 * To change advertisement visibility
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeAdvertisementVisibility: ApiParams = (req, res, next) => {
  advertisementHelpers
    .changeAdvertisementVisibility(req.params.aid)
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
 * To remove a advertisement image
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const removeAdvertisementImage: ApiParams = (req, res, next) => {
  advertisementHelpers
    .removeAdvertisementImage(req.params.aid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.advertisement,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To delete a non deleted advertisement temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAdvertisement: ApiParams = (req, res, next) => {
  advertisementHelpers
    .deleteAdvertisement(req.params.aid)
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
 * To restore a deleted advertisement
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreAdvertisement: ApiParams = (req, res, next) => {
  advertisementHelpers
    .restoreAdvertisement(req.params.aid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.advertisement,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a advertisement permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteAdvertisement: ApiParams = (req, res, next) => {
  advertisementHelpers
    .pDeleteAdvertisement(req.params.aid)
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
 * To delete all advertisement in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllAdvertisement: ApiParams = (req, res, next) => {
  advertisementHelpers
    .deleteAllAdvertisement()
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
