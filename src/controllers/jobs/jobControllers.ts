import { ErrorResponse } from '../../classes';
import { jobHelpers } from '../../helpers';

import { ApiParams } from '../../types';

/**
 * Get all jobs
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getJobs: ApiParams = (req, res, next) => {
  jobHelpers
    .getJobs
    // req.client!.role
    ()
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.jobs,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get all jobs for customer
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getJobsForCustomer: ApiParams = (req, res, next) => {
  jobHelpers
    .getJobsForCustomer()
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.jobs,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular job
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getJob: ApiParams = (req, res, next) => {
  jobHelpers
    .getJob(req.params.jid, req.client!.role)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.job,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To Signup a new job
 * METHOD : POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const addJob: ApiParams = (req, res, next) => {
  jobHelpers
    .addJob(req.client!.id, req.client!.role, req.body)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        job: resp.job,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To edit a job
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const editJob: ApiParams = (req, res, next) => {
  jobHelpers
    .editJob(req.params.jid, req.body, req.client)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.job,
      });
    })
    .catch((error: any) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * To change job status
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeJobStatus: ApiParams = (req, res, next) => {
  jobHelpers
    .changeJobStatus(req.params.jid, req.body.status, req.client?.id!)
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
 * To change job visibility
 * METHOD : PATCH
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const changeJobVisibility: ApiParams = (req, res, next) => {
  jobHelpers
    .changeJobVisibility(req.params.jid)
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
 * To delete a non deleted job temporarily
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteJob: ApiParams = (req, res, next) => {
  jobHelpers
    .deleteJob(req.params.jid)
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
 * To restore a deleted job
 * METHOD : PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const restoreJob: ApiParams = (req, res, next) => {
  jobHelpers
    .restoreJob(req.params.jid)
    .then((resp: any) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        data: resp.job,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a job permanently
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const pDeleteJob: ApiParams = (req, res, next) => {
  jobHelpers
    .pDeleteJob(req.params.jid)
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
 * To delete all job in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllJob: ApiParams = (req, res, next) => {
  jobHelpers
    .deleteAllJob()
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
