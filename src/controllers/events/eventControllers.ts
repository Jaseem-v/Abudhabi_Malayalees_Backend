import { ErrorResponse } from "../../classes";
import { deleteS3File } from "../../functions/s3";
import { eventHelpers } from "../../helpers";

import { ApiParams } from "../../types";

/**
 * Get all events
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getEvents: ApiParams = (req, res, next) => {
  eventHelpers
    .getEvents(req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.events,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get all events for customer
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getEventsForCustomer: ApiParams = (req, res, next) => {
  eventHelpers
    .getEventsForCustomer()
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.events,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular event
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getEvent: ApiParams = (req, res, next) => {
  eventHelpers
    .getEvent(req.params.eid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.event,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To Signup a new event
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addEvent: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  eventHelpers
    .addEvent(req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        event: resp.event,
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
 * To edit a event
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editEvent: ApiParams = (req, res, next) => {
  req.body.image = req.file;
  eventHelpers
    .editEvent(req.params.eid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.event,
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
 * To change event visibility
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeEventVisibility: ApiParams = (req, res, next) => {
  eventHelpers
    .changeEventVisibility(req.params.eid)
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
 * To remove a event image
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const removeEventImage: ApiParams = (
  req,
  res,
  next
) => {
  eventHelpers
    .removeEventImage(req.params.eid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.event,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To delete a non deleted event temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteEvent: ApiParams = (req, res, next) => {
  eventHelpers
    .deleteEvent(req.params.eid)
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
 * To restore a deleted event
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreEvent: ApiParams = (req, res, next) => {
  eventHelpers
    .restoreEvent(req.params.eid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.event,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a event permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteEvent: ApiParams = (req, res, next) => {
  eventHelpers
    .pDeleteEvent(req.params.eid)
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
 * To delete all event in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllEvent: ApiParams = (req, res, next) => {
  eventHelpers
    .deleteAllEvent()
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
