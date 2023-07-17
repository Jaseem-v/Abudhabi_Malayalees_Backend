import { Router } from 'express';
import { advertisementControllers } from '../../controllers';
import {
  adminAccess,
  allRoleAccess,
  superAdminAccess,
} from '../../middlewares';
import { s3Upload } from '../../functions/multer';
import { config } from '../../config';
import { guestAccess } from '../../middlewares/authmiddleware';
const {
  getAdvertisements,
  getOwnedAdvertisements,
  getOwnedAdvertisementsById,
  getAdvertisementsByRealEstate,
  getOwnedAdvertisementsByRealEstate,
  getOwnedAdvertisementsByRealEstateById,
  getAdvertisementsByUserCar,
  getOwnedAdvertisementsByUserCar,
  getOwnedAdvertisementsByUserCarById,
  getAdvertisementsByJob,
  getOwnedAdvertisementsByJob,
  getOwnedAdvertisementsByJobById,
  getAdvertisement,
  addAdvertisement,
  editAdvertisement,
  changeAdvertisementStatus,
  changeAdvertisementVisibility,
  removeAdvertisementImage,
  deleteAdvertisement,
  restoreAdvertisement,
  pDeleteAdvertisement,
  deleteAllAdvertisement,
} = advertisementControllers;

const router = Router();

const { AWS_S3_ADZ_RESOURCES } = config.AWS_S3;

router
  .route('/')
  .get(adminAccess, getAdvertisements)
  .post(
    allRoleAccess,
    s3Upload(AWS_S3_ADZ_RESOURCES, 'single', 'image'),
    addAdvertisement
  );
router.route('/owned').get(allRoleAccess, getOwnedAdvertisements);
router.route('/owned/:id').get(allRoleAccess, getOwnedAdvertisementsById);
router.route('/used-car').get(adminAccess, getAdvertisementsByUserCar);
router.route('/used-car/approved').get(guestAccess, getAdvertisementsByUserCar);
router
  .route('/used-car/owned')
  .get(allRoleAccess, getOwnedAdvertisementsByUserCar);
router
  .route('/used-car/owned/:id')
  .get(allRoleAccess, getOwnedAdvertisementsByUserCarById);
router.route('/real-estate').get(adminAccess, getAdvertisementsByRealEstate);
router
  .route('/real-estate/approved')
  .get(guestAccess, getAdvertisementsByRealEstate);
router
  .route('/real-estate/owned/:id')
  .get(allRoleAccess, getOwnedAdvertisementsByRealEstateById);
router.route('/job').get(adminAccess, getAdvertisementsByJob);
router.route('/job/approved').get(guestAccess, getAdvertisementsByJob);
router.route('/job/owned').get(allRoleAccess, getOwnedAdvertisementsByJob);
router
  .route('/job/owned/:id')
  .get(allRoleAccess, getOwnedAdvertisementsByJobById);
router.route('/delete/all').delete(superAdminAccess, deleteAllAdvertisement);
router
  .route('/change-status/:aid')
  .patch(adminAccess, changeAdvertisementStatus);
router
  .route('/change-visibility/:aid')
  .patch(adminAccess, changeAdvertisementVisibility);
router
  .route('/remove-image/:aid')
  .delete(adminAccess, removeAdvertisementImage);
router.route('/delete/:aid').delete(adminAccess, pDeleteAdvertisement);
router.route('/restore/:aid').put(superAdminAccess, restoreAdvertisement);
router
  .route('/:aid')
  .get(adminAccess, getAdvertisement)
  .patch(
    allRoleAccess,
    s3Upload(AWS_S3_ADZ_RESOURCES, 'single', 'image'),
    editAdvertisement
  )
  .delete(superAdminAccess, deleteAdvertisement);
router
  .route('/:uid/:role')
  .post(
    adminAccess,
    s3Upload(AWS_S3_ADZ_RESOURCES, 'single', 'image'),
    addAdvertisement
  );

export default router;
