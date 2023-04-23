// import sgMail from "@sendgrid/mail";
// import nodemailer from "nodemailer";
// import { config } from "../config/index.js";
// import {
//   generateCredentialsMailTemplate,
//   generateResetPasswdMailTemplate,
// } from "./index.js";

// const { SENDGRID_API_KEY } = config.SENDGRID;
// const {
//   MAIL_SERVICE_HOST,
//   MAIL_SERVICE_NAME,
//   MAIL_SERVICE_PORT,
//   MAIL_AUTH_USER,
//   MAIL_AUTH_NAME,
//   MAIL_AUTH_PASS,
// } = config.MAIL_SERVICE;

// /**
//  *
//  * @param {String} type - SendCredentials | ResetPassword
//  * @param {Object} body - { name, email, role, password } | { name, email, token }
//  * @returns
//  */
// const sendMail = (type, body) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { name, email, role, password, token } = body;

//       if (
//         !type ||
//         (type && !["SendCredentials", "ResetPassword"].includes(type)) ||
//         (type === "SendCredentials" &&
//           (!name || !email || !role || !password)) ||
//         (type === "ResetPassword" && (!name || !email || !token))
//       ) {
//         return reject({
//           message:
//             type === "SendCredentials"
//               ? "Provide name, email, role and password"
//               : type === "ResetPassword"
//               ? "Provide name, email and token"
//               : "Provide valid type",
//         });
//       }
//       await sendGridMail(type, body);
//       resolve({ success: true });
//     } catch (error) {
//       try {
//         await sendNodeMailer(type, body);
//         resolve({ success: true });
//       } catch (error) {
//         resolve({ success: false });
//       }
//     }
//   });
// };

// /**
//  * To send a mail through nodemailer
//  * @param {String} type - SendCredentials | ResetPassword
//  * @param {Object} body - { name, email, role, password } | { name, email, token }
//  * @returns success message
//  */
// export const sendNodeMailer = (type, body) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { name, email, role, password, token } = body;
//       if (
//         !type ||
//         (type && !["SendCredentials", "ResetPassword"].includes(type)) ||
//         (type === "SendCredentials" &&
//           (!name || !email || !role || !password)) ||
//         (type === "ResetPassword" && (!name || !email || !token))
//       ) {
//         return reject({
//           message:
//             type === "SendCredentials"
//               ? "Provide name, email, role and password"
//               : type === "ResetPassword"
//               ? "Provide name, email and token"
//               : "Provide valid type",
//         });
//       }

//       // create reusable transporter object using the default SMTP transport
//       const transporter = nodemailer.createTransport({
//         service: MAIL_SERVICE_NAME,
//         host: MAIL_SERVICE_HOST,
//         port: MAIL_SERVICE_PORT,
//         secure: MAIL_SERVICE_PORT == "465" ? true : false, // true for 465, false for other ports
//         secureConnection: false,
//         tls: {
//           ciphers: "SSLv3",
//         },
//         requireTLS: true,
//         debug: true,
//         auth: {
//           user: MAIL_AUTH_USER,
//           pass: MAIL_AUTH_PASS,
//         },
//       });

//       const message = {
//         from: `"${MAIL_AUTH_NAME}" <${MAIL_AUTH_USER}>`,
//         to: email,
//         subject:
//           type === "SendCredentials"
//             ? "Trentit Login Credentials"
//             : "Trentit Reset Password",
//         text:
//           type === "SendCredentials"
//             ? generateCredentialsMailTemplate("text", {
//                 name,
//                 email,
//                 role,
//                 password,
//               })
//             : generateResetPasswdMailTemplate("text", { name, email, token }),
//         html:
//           type === "SendCredentials"
//             ? generateCredentialsMailTemplate("html", {
//                 name,
//                 email,
//                 role,
//                 password,
//               })
//             : generateResetPasswdMailTemplate("html", { name, email, token }),
//       };

//       const info = await transporter.sendMail(message);
//       resolve({
//         success: true,
//         message: `Message sent: ${info.messageId}`,
//       });
//     } catch (error) {
//       console.log("Email not sent! in Nodemailer => ", error.message);
//       reject({ message: error.message, code: error.code });
//     }
//   });
// };

// /**
//  * To send a mail through sendgrid
//  * @param {String} type - SendCredentials | ResetPassword
//  * @param {Object} body - { name, email, role, password } | { name, email, token }
//  * @returns success message
//  */
// export const sendGridMail = (type, body) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { name, email, role, password, token } = body;

//       if (
//         !type ||
//         (type && !["SendCredentials", "ResetPassword"].includes(type)) ||
//         (type === "SendCredentials" &&
//           (!name || !email || !role || !password)) ||
//         (type === "ResetPassword" && (!name || !email || !token))
//       ) {
//         return reject({
//           message:
//             type === "SendCredentials"
//               ? "Provide name, email, role and password"
//               : type === "ResetPassword"
//               ? "Provide name, email and token"
//               : "Provide valid type",
//         });
//       }

//       sgMail.setApiKey(SENDGRID_API_KEY);
//       const message = {
//         from: `"${MAIL_AUTH_NAME}" <${MAIL_AUTH_USER}>`,
//         to: email,
//         subject:
//           type === "SendCredentials"
//             ? "Trentit Login Credentials"
//             : "Trentit Reset Password",
//         text:
//           type === "SendCredentials"
//             ? generateCredentialsMailTemplate("text", {
//                 name,
//                 email,
//                 role,
//                 password,
//               })
//             : generateResetPasswdMailTemplate("text", { name, email, token }),
//         html:
//           type === "SendCredentials"
//             ? generateCredentialsMailTemplate("html", {
//                 name,
//                 email,
//                 role,
//                 password,
//               })
//             : generateResetPasswdMailTemplate("html", { name, email, token }),
//       };
//       await sgMail.send(message);
//       resolve({ success: true, message: "Mail sended" });
//     } catch (error) {
//       console.log("Email not sent! in Sendgrid => ", error.message);
//       reject({
//         message: error.message || error.msg,
//         code: error.code || error.name,
//       });
//     }
//   });
// };

// export default sendMail;
