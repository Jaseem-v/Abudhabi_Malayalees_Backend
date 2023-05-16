import multer, { FileFilterCallback } from "multer";
import { S3 } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";

import { config } from "../config";

const {
  AWS_S3_BUCKET_NAME,
  AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY,
  AWS_S3_BUCKET_REGION,
} = config.AWS_S3;

/**
 * S3 Upload
 * @param {*} path
 * @param {*} type
 * @param {*} fieldname
 * @returns
 */
export const s3Upload = (
  path: string,
  type: "single" | "multiple" | "fields",
  fieldname: any
) => {
  const s3storage = multerS3({
    s3: new S3({
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY,
      },
      region: AWS_S3_BUCKET_REGION,
    }),
    bucket: AWS_S3_BUCKET_NAME,
    // acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (
      req: Express.Request,
      file: Express.Multer.File,
      cb: any
    ) {
      cb(null, { originalName: file.originalname });
    },
    key(req: Express.Request, file: Express.Multer.File, cb: any) {
      const id = uuidv4() + "." + file.mimetype.split("/")[1];
      const filePath = path === "/" ? id : path + "/" + id;
      cb(null, filePath);
    },
  });

  const multerS3upload = multer({
    storage: s3storage,
    limits: {
      fileSize: 1024 * 1024 * 80,
    },
    fileFilter: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      if (
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.mimetype
        )
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  });
  if (type === "multiple") {
    return multerS3upload.array(fieldname || "images");
  } else if (type === "fields") {
    return multerS3upload.fields(fieldname);
  } else {
    return multerS3upload.single(fieldname || "image");
  }
};
