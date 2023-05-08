import mongoose from "mongoose";
import { config } from "../../config/index";
import { Job } from "../../models";
import { ThrowError } from "../../classes";
import { IRoles } from "../../types/default";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;

/**
 * To get all jobs
 * @returns {Jobs} jobs
 */
export const getJobs = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const jobs = await Job.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: "Jobs Fetched",
        jobs,
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
 * To get a particular job by id
 * @param {String} jobId
 * @returns {Job} job
 */
export const getJob = (jobId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!jobId || !isValidObjectId(jobId))
        throw new ThrowError("Provide vaild job id", 404);

      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const job = await Job.findOne({ _id: jobId, ...query });

      if (!job) {
        return reject({
          message: "Job not found",
          statusCode: 404,
        });
      }
      resolve({ message: "Job fetched", job });
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
 * To add a new job
 * @param {Job} data
 * @returns job
 */
export const addJob = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { desc, categoryId, visibility } = data;
      if (!desc || !categoryId || !isValidObjectId(categoryId) || !visibility)
        throw new ThrowError(
          "Please Provide  desc, categoryId and visibility",
          400
        );

      const job = await new Job({
        code: "",
        desc,
        category: categoryId,
        status: "PENDING",
        visibility: "Show",
      });

      const njob = await job.save();

      resolve({
        message: "Job created successfully",
        job: njob,
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
 * To edit a job
 * @param {String} jobId
 * @param {Job} data
 * @returns
 */
export const editJob = (jobId: string, data: any, client: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!jobId || !isValidObjectId(jobId))
        throw new ThrowError("Provide vaild job id", 400);

      const job = await Job.findById(jobId);

      if (!job) throw new ThrowError("Job not found", 404);

      const { desc, visibility } = data;

      // Update a values in db
      job.desc = desc || job.desc;
      job.visibility = visibility || job.visibility;

      const njob = await job.save();

      resolve({ message: "Job edited successfully", job: njob });
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
 * To change a status for job
 * @param {String} jobId
 * @returns {Job} job
 */
export const changeJobStatus = (
  jobId: string,
  status: "APPROVE" | "REJECT",
  clientId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !jobId ||
        !isValidObjectId(jobId) ||
        status ||
        !["APPROVE", "REJECT"].includes(status)
      ) {
        return reject({
          message: "Provide vaild job id and status ('APPROVE', 'REJECT')",
          statusCode: 404,
        });
      }

      const job = await Job.findById(jobId);
      if (
        !job ||
        (job.status === "APPROVED" && status === "APPROVE") ||
        (job.status === "REJECTED" && status === "REJECT")
      )
        throw new ThrowError(
          !job
            ? "Job not found"
            : job.status === "APPROVED" && status === "APPROVE"
            ? "Job already approved"
            : "Job already rejected",
          404
        );

      job.status = status === "APPROVE" ? "APPROVED" : "REJECTED";

      if (status === "APPROVE") {
        job.statusLog.approvedAt = new Date();
        job.statusLog.approvedBy = clientId;
      } else {
        job.statusLog.rejectedAt = new Date();
        job.statusLog.rejectedBy = clientId;
      }

      const njob = await job.save(); 

      resolve({
        message: `${njob.code}'s status changed to ${njob.status}`,
        job: njob,
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
 * To change a visibility for job
 * @param {String} jobId
 * @returns {Job} job
 */
export const changeJobVisibility = (jobId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!jobId || !isValidObjectId(jobId)) {
        return reject({
          message: "Provide vaild job id",
          statusCode: 404,
        });
      }

      const job = await Job.findById(jobId);
      if (!job) throw new ThrowError("Job not found", 404);

      job.visibility = job.visibility === "Show" ? "Hide" : "Show";

      const njob = await job.save();

      resolve({
        message: `${njob.code}'s visibility changed to ${njob.visibility}`,
        job: njob,
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
 * To delete a non deleted job temporarily
 * @param {String} jobId
 */
export const deleteJob = (jobId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!jobId || !isValidObjectId(jobId))
        throw new ThrowError("Provide valid job id", 400);

      const job = await Job.findOne({
        _id: jobId,
        isDeleted: false,
      });

      if (!job) throw new ThrowError("Job not found", 404);

      job.visibility = "Show";
      job.isDeleted = true;
      job.deletedAt = new Date();

      await job.save();

      resolve({
        message: `${job.code} job was deleted`,
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
 * To restore a deleted job
 * @param {String} jobId
 * @returns job
 */
export const restoreJob = (jobId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!jobId || !isValidObjectId(jobId))
        throw new ThrowError("Provide valid job id", 400);

      const job = await Job.findOne({
        _id: jobId,
        isDeleted: true,
      });

      if (!job) {
        return reject({
          message: "Job not found",
          statusCode: 404,
        });
      }

      job.visibility = "Show";
      job.isDeleted = false;
      job.deletedAt = undefined;

      const njob = await job.save();

      resolve({
        message: `${njob.code} job was restored`,
        job: njob,
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
 * To delete a job permanently
 * @param {String} jobId
 */
export const pDeleteJob = (jobId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!jobId || !isValidObjectId(jobId))
        throw new ThrowError("Provide valid job id", 400);

      const job = await Job.findOne({
        _id: jobId,
        isDeleted: true,
      });

      if (!job) {
        return reject({
          message: "Job not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await job.deleteOne();
        return resolve({
          message: `${job.code} category was deleted`,
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
 * To delete all job in development mode
 */
export const deleteAllJob = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await Job.deleteMany({});
        return resolve({ message: "All job deleted" });
      }
      throw new ThrowError(
        `Not able to delete all jobs in ${NODE_ENV} mode`,
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
