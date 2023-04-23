// import { S3 } from "@aws-sdk/client-s3";
// import { config } from "../config/index.js";

// const { AWS_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_REGION } =
//   config.AWS;

// const s3 = new S3({
//   region: AWS_BUCKET_REGION,
//   credentials: {
//     accessKeyId: AWS_ACCESS_KEY,
//     secretAccessKey: AWS_SECRET_KEY,
//   },
// });

// export const uploadFile = (file, count, id) => {
//   // return new Promise(async (resolve, reject) => {
//   //   let responseData = [];
//   //   try {
//   //     if (count > 1) {
//   //       file.map(async (item, index) => {
//   //         const fileStream = fs.createReadStream(item.path);
//   //         const uploadParams = {
//   //           Bucket: AWS_BUCKET_NAME,
//   //           Body: fileStream,
//   //           Key: index == 0 ? String(id + ".jpg") : String(id[index] + ".jpg"),
//   //         };
//   //         const data = await s3.upload(uploadParams);
//   //         responseData.push(data);
//   //       });
//   //       if (responseData.length === file.length) {
//   //         return resolve({
//   //           message: "Image Uploaded Successfully",
//   //           data: responseData,
//   //         });
//   //       } else {
//   //         return reject({
//   //           message: "Upload Failed",
//   //           statusCode: 400,
//   //         });
//   //       }
//   //     } else if (count == 1) {
//   //       const fileStream = fs.createReadStream(file.path);
//   //       const uploadParams = {
//   //         Bucket: AWS_BUCKET_NAME,
//   //         Body: fileStream,
//   //         Key: String(id),
//   //         ContentType: file.mimetype,
//   //       };
//   //       const result = s3.upload(uploadParams).promise();
//   //       console.log("Image Uploaded Successfully");
//   //       resolve({
//   //         message: "Image Uploaded Successfully",
//   //         data: result,
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.log(error, "errory");
//   //     return reject({
//   //       message: error.message || error.msg,
//   //       code: error.code || error.name,
//   //     });
//   //   }
//   // });
// };

// export const getS3File = (key, path) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const Key = path === "/" ? key : path + "/" + key;
//       const imageObject = await s3.getObject({ Key, Bucket: AWS_BUCKET_NAME });
//       resolve(imageObject.Body);
//     } catch (error) {
//       console.log(error);
//       reject({
//         message: error.message || error.msg,
//         code: error.code || error.name,
//       });
//     }
//   });
// };

// export const deleteS3File = (key) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const resp = await s3.deleteObject({
//         Bucket: AWS_BUCKET_NAME,
//         Key: key,
//       });
//       resolve(resp);
//     } catch (error) {
//       console.log(error);
//       reject({
//         message: error.message || error.msg,
//         code: error.code || error.name,
//       });
//     }
//   });
// };
