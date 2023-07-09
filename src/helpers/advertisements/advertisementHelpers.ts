import mongoose from 'mongoose';
import { config } from '../../config/index';
import { Advertisement, Category } from '../../models';
import { ThrowError } from '../../classes';
import { IRoles } from '../../types/default';
import { IAdvertisement } from '../../interfaces';

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;
const { BUSINESS_ACCOUNTS, PERSONAL_ACCOUNTS, ADMINS } =
  config.MONGO_COLLECTIONS;

/**
 * To get all advertisements
 * @returns {Advertisements} advertisements
 */
export const getAdvertisements = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ['SuperAdmin', 'Developer'].includes(role ?? '')
        ? {}
        : { isDeleted: false };
      const advertisements = await Advertisement.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: 'Advertisements Fetched',
        advertisements,
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
 * To get all advertisements for customer
 * @returns {Advertisements} advertisements
 */
export const getAdvertisementsForCustomer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const advertisements = await Advertisement.find({
        visibility: 'Show',
        status: 'APPROVED',
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
        .populate('category', 'name image status visibility');

      resolve({
        message: 'Advertisements Fetched',
        advertisements,
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
 * To get all advertisements by type
 * @returns {Advertisements} advertisements
 */
export const getAdvertisementsByType = (
  type: IAdvertisement['type'],
  role?: IRoles
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ['SuperAdmin', 'Developer'].includes(role ?? '')
        ? {}
        : { status: 'APPROVED', visibility: 'Show' };
      const advertisements = await Advertisement.find({
        ...query,
        type,
        isDeleted: false,
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
        .populate('category', 'name image status visibility');

      resolve({
        message: 'Advertisements Fetched',
        advertisements,
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
 * To get a particular advertisement by id
 * @param {String} advertisementId
 * @returns {Advertisement} advertisement
 */
export const getAdvertisement = (advertisementId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError('Provide vaild advertisement id', 404);

      const query = ['SuperAdmin', 'Developer'].includes(role ?? '')
        ? {}
        : { isDeleted: false };
      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        ...query,
      })
        .populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
        .populate('category', 'name image status visibility');

      if (!advertisement) {
        return reject({
          message: 'Advertisement not found',
          statusCode: 404,
        });
      }
      resolve({ message: 'Advertisement fetched', advertisement });
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
 * To add a new advertisement
 * @param {Advertisement} data
 * @returns advertisement
 */
export const addAdvertisement = (
  clientId: string,
  clientRole: IRoles,
  data: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { categoryId, desc, type, image, visibility } = data;
      if (
        !clientId ||
        !clientRole ||
        ![
          'BusinessAccount',
          'PersonalAccount',
          'SuperAdmin',
          'DeveloperAdmin',
          'Admin',
        ].includes(clientRole) ||
        !desc ||
        !image ||
        !type ||
        !['REAL_ESTATE', 'USED_CAR', 'JOB'].includes(type) ||
        (type === 'JOB' && !categoryId) ||
        !visibility
      )
        throw new ThrowError(
          "Please Provide image, desc*, type('REAL_ESTATE', 'USED_CAR')*, category(type === 'JOB') and visibility",
          400
        );

      if (type === 'JOB') {
        const category = await Category.findById(categoryId);

        if (!category || category.type != 'JOB')
          throw new ThrowError('Please Provide valid job category', 400);
      }

      const lastCode = await Advertisement.find({}, { code: 1, _id: 0 })
        .limit(1)
        .sort({ createdAt: -1 });
      data.code =
        lastCode.length === 1
          ? 'ADZ' + (parseInt(lastCode[0].code.slice(3)) + 1)
          : 'ADZ100';

      const advertisement = await new Advertisement({
        code: data.code,
        categoryId,
        createdBy: clientId,
        createdByRole:
          clientRole === 'BusinessAccount'
            ? BUSINESS_ACCOUNTS
            : clientRole === 'PersonalAccount'
            ? PERSONAL_ACCOUNTS
            : ADMINS,
        desc: desc,
        type: type,
        image: null,
        status: 'PENDING',
        visibility: 'Show',
      });

      if (image && image.key && image.mimetype) {
        // Delete Image
        advertisement.image = {
          key: image.key.split('/').slice(-1)[0],
          mimetype: image.mimetype,
        };
      }

      const nadvertisement = await (
        await (
          await advertisement.save()
        ).populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
      ).populate('category', 'name image status visibility');

      resolve({
        message: 'Advertisement created successfully',
        advertisement: nadvertisement,
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
 * To edit a advertisement
 * @param {String} advertisementId
 * @param {Advertisement} data
 * @returns
 */
export const editAdvertisement = (advertisementId: string, data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError('Provide vaild advertisement id', 400);

      const advertisement = await Advertisement.findById(advertisementId);

      if (!advertisement) throw new ThrowError('Advertisement not found', 404);

      const { image, desc, visibility } = data;

      // Update a values in db
      advertisement.desc = desc || advertisement.desc;
      advertisement.visibility = visibility || advertisement.visibility;

      if (image && image.key && image.mimetype) {
        // Delete Image
        advertisement.image = {
          key: image.key.split('/').slice(-1)[0],
          mimetype: image.mimetype,
        };
      }

      const nadvertisement = await (
        await (
          await advertisement.save()
        ).populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
      ).populate('category', 'name image status visibility');

      resolve({
        message: 'Advertisement edited successfully',
        advertisement: nadvertisement,
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
 * To change a status for advertisement
 * @param {String} advertisementId
 * @returns {Advertisement} advertisement
 */
export const changeAdvertisementStatus = (
  advertisementId: string,
  status: 'APPROVE' | 'REJECT',
  clientId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !advertisementId ||
        !isValidObjectId(advertisementId) ||
        !status ||
        !['APPROVE', 'REJECT'].includes(status)
      ) {
        return reject({
          message:
            "Provide vaild advertisement id and status ('APPROVE', 'REJECT')",
          statusCode: 404,
        });
      }

      const advertisement = await Advertisement.findById(advertisementId);
      if (
        !advertisement ||
        (advertisement.status === 'APPROVED' && status === 'APPROVE') ||
        (advertisement.status === 'REJECTED' && status === 'REJECT')
      )
        throw new ThrowError(
          !advertisement
            ? 'Advertisement not found'
            : advertisement.status === 'APPROVED' && status === 'APPROVE'
            ? 'Advertisement already approved'
            : 'Advertisement already rejected',
          404
        );

      advertisement.status = status === 'APPROVE' ? 'APPROVED' : 'REJECTED';

      if (status === 'APPROVE') {
        advertisement.statusLog.approvedAt = new Date();
        advertisement.statusLog.approvedBy = clientId;
      } else {
        advertisement.statusLog.rejectedAt = new Date();
        advertisement.statusLog.rejectedBy = clientId;
      }

      const nadvertisement = await (
        await (
          await advertisement.save()
        ).populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
      ).populate('category', 'name image status visibility');

      resolve({
        message: `${nadvertisement.code}'s status changed to ${nadvertisement.status}`,
        advertisement: nadvertisement,
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
 * To change a visibility for advertisement
 * @param {String} advertisementId
 * @returns {Advertisement} advertisement
 */
export const changeAdvertisementVisibility = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId)) {
        return reject({
          message: 'Provide vaild advertisement id',
          statusCode: 404,
        });
      }

      const advertisement = await Advertisement.findById(advertisementId);
      if (!advertisement) throw new ThrowError('Advertisement not found', 404);

      advertisement.visibility =
        advertisement.visibility === 'Show' ? 'Hide' : 'Show';

      const nadvertisement = await (
        await (
          await advertisement.save()
        ).populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
      ).populate('category', 'name image status visibility');

      resolve({
        message: `${nadvertisement.code}'s visibility changed to ${nadvertisement.visibility}`,
        advertisement: nadvertisement,
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
 * to remove a advertisement image
 * @param {String} advertisementId
 * @returns advertisement
 */
export const removeAdvertisementImage = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId)) {
        return reject({
          message: 'Provide valid advertisement id',
          statusCode: 400,
        });
      }

      const advertisement = await Advertisement.findById(advertisementId);

      if (!advertisement) {
        return reject({
          message: 'Advertisement not found',
          statusCode: 404,
        });
      }

      advertisement.image = null;

      const nadvertisement = await (
        await (
          await advertisement.save()
        ).populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
      ).populate('category', 'name image status visibility');

      resolve({
        message: 'Advertisement image removed successfully',
        advertisement: nadvertisement,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete a non deleted advertisement temporarily
 * @param {String} advertisementId
 */
export const deleteAdvertisement = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError('Provide valid advertisement id', 400);

      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        isDeleted: false,
      });

      if (!advertisement) throw new ThrowError('Advertisement not found', 404);

      advertisement.visibility = 'Show';
      advertisement.isDeleted = true;
      advertisement.deletedAt = new Date();

      await advertisement.save();

      resolve({
        message: `${advertisement.code} advertisement was deleted`,
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
 * To restore a deleted advertisement
 * @param {String} advertisementId
 * @returns advertisement
 */
export const restoreAdvertisement = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError('Provide valid advertisement id', 400);

      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        isDeleted: true,
      });

      if (!advertisement) {
        return reject({
          message: 'Advertisement not found',
          statusCode: 404,
        });
      }

      advertisement.visibility = 'Show';
      advertisement.isDeleted = false;
      advertisement.deletedAt = undefined;

      const nadvertisement = await (
        await (
          await advertisement.save()
        ).populate(
          'createdBy',
          'fname lname name email phone username profilePicture'
        )
      ).populate('category', 'name image status visibility');

      resolve({
        message: `${nadvertisement.code} advertisement was restored`,
        advertisement: nadvertisement,
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
 * To delete a advertisement permanently
 * @param {String} advertisementId
 */
export const pDeleteAdvertisement = (advertisementId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!advertisementId || !isValidObjectId(advertisementId))
        throw new ThrowError('Provide valid advertisement id', 400);

      const advertisement = await Advertisement.findOne({
        _id: advertisementId,
        isDeleted: true,
      });

      if (!advertisement) {
        return reject({
          message: 'Advertisement not found',
          statusCode: 404,
        });
      }

      if (NODE_ENV === 'development') {
        await advertisement.deleteOne();
        return resolve({
          message: `${advertisement.code} advertisement was deleted`,
        });
      }
      throw new ThrowError(
        `Not able to delete advertisement in ${NODE_ENV} mode`,
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
 * To delete all advertisement in development mode
 */
export const deleteAllAdvertisement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === 'development') {
        await Advertisement.deleteMany({});
        return resolve({ message: 'All advertisement deleted' });
      }
      throw new ThrowError(
        `Not able to delete all advertisements in ${NODE_ENV} mode`,
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
