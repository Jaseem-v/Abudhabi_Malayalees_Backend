import {
    PutObjectCommand,
    PutObjectCommandOutput,
    S3,
  } from "@aws-sdk/client-s3";
  import { config } from "../config";
  
  const {
    AWS_S3_BUCKET_NAME,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY,
    AWS_S3_BUCKET_REGION,
  } = config.AWS_S3;
  
  const s3 = new S3({
    region: AWS_S3_BUCKET_REGION,
    credentials: {
      accessKeyId: AWS_S3_ACCESS_KEY,
      secretAccessKey: AWS_S3_SECRET_KEY,
    },
  });
  
  export const getS3File = (key: string, path: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const Key = path === "/" ? key : path + "/" + key;
        const imageObject = await s3.getObject({
          Key,
          Bucket: AWS_S3_BUCKET_NAME,
        });
        resolve(imageObject.Body);
      } catch (error: any) {
        console.log(error);
        reject({
          message: error.message || error.msg,
          code: error.code || error.name,
        });
      }
    });
  };
  
  export const uploadFile = (file: Buffer | string, key: string, mimetype: string) => {
    return new Promise<{ message: string; data: PutObjectCommandOutput }>(
      async (resolve, reject) => {
        try {
          const uploadParams = {
            Bucket: AWS_S3_BUCKET_NAME,
            Body: file,
            Key: key,
            ContentType: mimetype,
          };
          const result = await s3.send(new PutObjectCommand(uploadParams));
          resolve({
            message: "Image Uploaded Successfully",
            data: result,
          });
        } catch (error: any) {
          console.log(error);
          return reject({
            message: error.message || error.msg,
            code: error.code || error.name,
          });
        }
      }
    );
  };
  
  export const deleteS3File = (key: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await s3.deleteObject({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: key,
        });
        resolve(resp);
      } catch (error: any) {
        console.log(error);
        reject({
          message: error.message || error.msg,
          code: error.code || error.name,
        });
      }
    });
  };
  