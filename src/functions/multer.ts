// import multer from "multer";
// import { S3 } from "@aws-sdk/client-s3";
// import multerS3 from "multer-s3";
// import fs from "fs";
// import { v4 as uuidv4 } from "uuid";

// import { config } from "../config/index.js";

// const { SERVER_UPLOADS_PATH } = config.SERVER;
// const { AWS_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_REGION } =
//   config.AWS;

// // File Filter
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/heic" ||
//     file.mimetype === "image/heif" ||
//     file.mimetype === "image/svg+xml" ||
//     file.mimetype === "image/svg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// /**
//  *
//  * @param {*} path
//  * @param {*} type
//  * @param {*} fieldname
//  * @returns
//  */
// export const uploadFiles = (...args) => s3Upload(args);

// /** S3 Upload */
// /**
//  *
//  * @param {*} path
//  * @param {*} type
//  * @param {*} fieldname
//  * @returns
//  */
// export const s3Upload = (path, type = "single", fieldname) => {
//   const s3storage = multerS3({
//     s3: new S3({
//       credentials: {
//         accessKeyId: AWS_ACCESS_KEY,
//         secretAccessKey: AWS_SECRET_KEY,
//       },
//       region: AWS_BUCKET_REGION,
//     }),
//     limits: 800000,
//     bucket: AWS_BUCKET_NAME,
//     // acl: "public-read",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: function (req, file, cb) {
//       cb(null, { originalName: file.originalname });
//     },
//     key: function (req, file, cb) {
//       const id = uuidv4() + "." + file.mimetype.split("/")[1];
//       const filePath = path === "/" ? id : path + "/" + id;
//       cb(null, filePath);
//     },
//   });

//   const multerS3upload = multer({
//     storage: s3storage,
//     limits: {
//       fileSize: 1024 * 1024 * 80,
//     },
//     fileFilter: fileFilter,
//   });
//   if (type === "multiple") {
//     return multerS3upload.array(fieldname || "images");
//   } else if (type === "fields") {
//     return multerS3upload.fields(fieldname);
//   } else {
//     return multerS3upload.single(fieldname || "image");
//   }
// };

// /** Server Upload */
// export const serverUpload = (path, type = "single", fieldname) => {
//   const serverStorage = multer.diskStorage({
//     destination: function (req, _file, cb) {
//       cb(null, SERVER_UPLOADS_PATH + path);
//     },
//     filename: function (req, file, cb) {
//       const id = uuidv4() + "." + file.mimetype.split("/")[1];
//       cb(null, id);
//     },
//   });

//   const multerServerUpload = multer({
//     storage: serverStorage,
//     limits: {
//       fileSize: 1024 * 1024 * 80,
//     },
//     fileFilter: fileFilter,
//   });
//   if (type === "multiple") {
//     return multerServerUpload.array(fieldname || "images");
//   } else if (type === "fields") {
//     return multerServerUpload.fields(fieldname);
//   } else {
//     return multerServerUpload.single(fieldname || "image");
//   }
// };

// export const removeFile = (path) => {
//   if (checkFileExist(path)) {
//     fs.unlinkSync(SERVER_UPLOADS_PATH + path);
//   }
// };

// export const checkFileExist = (path) => {
//   return fs.existsSync(SERVER_UPLOADS_PATH + path);
// };
