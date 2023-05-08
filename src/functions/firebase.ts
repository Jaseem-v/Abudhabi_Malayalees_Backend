// import firebase from "firebase-admin";
import { config } from "../config/index";

// const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } =
//   config.FIREBASE;

// Initialize Firebase
// const app = firebase.initializeApp({
//   credential: firebase.credential.cert({
//     project_id: FIREBASE_PROJECT_ID,
//     private_key: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     client_email: FIREBASE_CLIENT_EMAIL,
//   }),
// });

// const getAuth = app.auth;

export const verifyFirebaseToken = (token: string) => {
  return new Promise(async (resolve, reject) => {
    // try {
    //   const decodedToken = await getAuth().verifyIdToken(token);
    //   resolve(decodedToken);
    // } catch (error) {
    //   reject(error);
    // }
  });
};

export const getFirebaseUserByUid = (uid: string) => {
  return new Promise(async (resolve, reject) => {
    // getAuth()
    //   .getUser(uid)
    //   .then((userRecord) => {
    //     resolve(userRecord.toJSON());
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });
  });
};

export const getFirebaseUserByPhone = (phone: string) => {
  return new Promise(async (resolve, reject) => {
    // getAuth()
    //   .getUserByPhoneNumber(phone)
    //   .then((userRecord) => {
    //     resolve(userRecord.toJSON());
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });
  });
};

export const deleteFirebaseUser = (uid: string) => {
  return new Promise(async (resolve, reject) => {
    // getAuth()
    //   .deleteUser(uid)
    //   .then((userRecord) => {
    //     resolve(userRecord.toJSON());
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });
  });
};

/**
 *
 * @param {String} title
 * @param {String} body
 * @param {String} image
 * @param {String} click_action
 * @param {String[]} tokens - limit upto 500
 */
const sentNotifications = (title: string, body: string, image: string, click_action: string, tokens: string[]) => {
  // Create a list containing up to 500 registration tokens.

  // const registrationTokens = tokens;

  // const message = {
  //   notification: {
  //     title,
  //     body,
  //   },
  //   tokens: registrationTokens,
  //   android: {
  //     // ttl: "86400s",
  //     priority: "normal",
  //     notification: {
  //       imageUrl: image,
  //       click_action,
  //     },
  //   },
  //   apns: {
  //     headers: {
  //       "apns-priority": "5",
  //       // "apns-expiration": "1604750400",
  //     },
  //     payload: {
  //       aps: {
  //         "mutable-content": 1,
  //         category: click_action,
  //       },
  //     },
  //     fcm_options: {
  //       image,
  //     },
  //   },
  //   webpush: {
  //     headers: {
  //       Urgency: "high",
  //       image,
  //       // TTL: "86400",
  //     },
  //   },
  // };
  // admin
  //   .messaging()
  //   .sendMulticast(message)
  //   .then(({ successCount, failureCount, responses }) => {
  //     console.log(
  //       successCount + " messages were sent successfully",
  //       failureCount + " messages were failed"
  //     );
  //     if (failureCount > 0) {
  //       const failedTokens = [];
  //       responses.forEach((resp, idx) => {
  //         if (!resp.success) {
  //           failedTokens.push(registrationTokens[idx]);
  //         }
  //       });
  //       console.log("List of tokens that caused failures: " + failedTokens);
  //     }
  //     // return resolve({
  //     //   success: true,
  //     //   message: successCount + " messages were sent successfully",
  //     //   successCount,
  //     //   failureCount,
  //     // });
  //   })
  //   .catch((error) => {
  //     console.log("Notification not sent!");
  //     console.log(error);
  //     // resolve({ success: false, message: error.message, code: error.code });
  //   });
};
