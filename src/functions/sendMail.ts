import { config } from "../config";
import emailjs from "@emailjs/nodejs";

const { EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } =
  config.EMAILJS;

/**
 * To send a mail through emailjs
 * @param {Object} data - { templateId, templateData}
 * @returns success message
 */
export const sendMail = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { templateId, templateData } = data;

      if (!templateId || !templateData) {
        return reject({
          message: "Provide templateId and templateData",
        });
      }

      const resp = await emailjs.send(
        EMAILJS_SERVICE_ID,
        templateId,
        templateData,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
          privateKey: EMAILJS_PRIVATE_KEY,
        }
      );
      console.log(resp);
      resolve({ success: true, message: "Mail sended" });
    } catch (error: any) {
      console.log(error);
      console.log("Email not sent! in EmailJs => ", error.message);
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};
