import mongoose from "mongoose";
import { config } from "../../config/index";
import { PersonalAccount } from "../../models/index";
import { generateToken, verifyToken } from "../../utils/index";
import { ThrowError } from "../../classes/index";
import { IRoles } from "../../types/default";
import { sendMail } from "../../functions";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;
const { CLIENT_DOMAIN } = config.CLIENT;
const { EMAILJS_VERIFICATION_TEMPLATE_ID, EMAILJS_RESET_TEMPLATE_ID } =
  config.EMAILJS;

const PERSONAL_ACCOUNT_USERNAME_STARTS_WITH = "pa-";

/**
 * To get all personalAccounts
 * @returns {PersonalAccounts} personalAccounts
 */
export const getPersonalAccounts = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const personalAccounts = await PersonalAccount.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: "PersonalAccounts Fetched",
        personalAccounts,
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
 * To get a particular personalAccount by id
 * @param {String} personalAccountId
 * @returns {PersonalAccount} personalAccount
 */
export const getPersonalAccount = (
  personalAccountId: string,
  role?: IRoles
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId))
        throw new ThrowError("Provide vaild personalAccount id", 404);

      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const personalAccount = await PersonalAccount.findOne({
        _id: personalAccountId,
        ...query,
      });

      if (!personalAccount) {
        return reject({
          message: "PersonalAccount not found",
          statusCode: 404,
        });
      }
      resolve({ message: "PersonalAccount fetched", personalAccount });
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
 * To login a personalAccount's account by email and password
 * @param {String} username
 * @param {String} email
 * @param {String} phone
 * @param {String} password
 * @returns {String} token
 */
export const personalAccountLogin = (
  username: string,
  email: string,
  phone: string,
  password: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((!username && !email && !phone) || !password)
        throw new ThrowError(
          "Provide username or email or phone and password",
          400
        );

      const personalAccount = await PersonalAccount.findOne(
        { $or: [{ username }, { email }, { phone }] },
        { password: 1, fname: 1, role: 1, status: 1, lastSync: 1 }
      );

      if (!personalAccount)
        throw new ThrowError(
          `Invalid ${
            username ? "Username" : phone ? "Phone" : "Email"
          } or Password`,
          400
        );
      if (personalAccount.status === "Blocked")
        throw new ThrowError(`Account blocked! contact Customer Care`, 401);

      if (personalAccount && (await personalAccount.matchPassword(password))) {
        if (personalAccount.status === "Inactive")
          personalAccount.status = "Active";
        personalAccount.lastSync = new Date();
        await personalAccount.save();

        const token = await generateToken({
          id: personalAccount._id.toString(),
          name: personalAccount.fname,
          role: "PersonalAccount",
          type: "AccessToken",
        });
        resolve({
          message: "Login Success",
          token,
        });
      } else {
        throw new ThrowError(
          `Invalid ${
            username ? "Username" : phone ? "Phone" : "Email"
          } or Password`,
          400
        );
      }
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
 * To add a new personalAccount
 * @param {PersonalAccount} data
 * @returns personalAccount
 */
export const addPersonalAccount = (data: any, adminId?: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        fname,
        lname,
        username,
        phone,
        about,
        socialMediaLinks,
        email,
        password,
      } = data;
      if (!fname || !lname || !username || !phone || !email || !password)
        throw new ThrowError(
          `Please Provide fname, lname, username, phone, email and password`,
          400
        );

      if (!username.includes(PERSONAL_ACCOUNT_USERNAME_STARTS_WITH))
        throw new ThrowError("Invalid Username", 404);

      const personalAccountExists = await PersonalAccount.findOne({
        $or: [{ email }, { phone }, { username }],
      });

      if (personalAccountExists)
        throw new ThrowError("PersonalAccount already exist!", 401);

      const personalAccount = await new PersonalAccount({
        fname,
        lname,
        username,
        phone,
        email,
        about: about ?? "NO ABOUT",
        profilePicture: null,
        gallerys: [],
        socialMediaLinks,
        password,
        lastSync: new Date(),
        lastUsed: new Date(),
        manual: typeof adminId === "string",
        createdBy: adminId,
      });

      const npersonalAccount = await personalAccount.save();

      if (typeof adminId != "string") {
        sendVerificationMailPersonalAccount(
          personalAccount.email,
          personalAccount.username,
          false
        )
          .then()
          .catch((error: any) => console.log(error.message));
      }

      resolve({
        message: "Account created successfully",
        personalAccount: npersonalAccount,
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
 * To send a reset link to email
 * @param {String} email
 * @param {String} username
 * @param {Boolean} isAdmin
 * @returns
 */
export const sendVerificationMailPersonalAccount = (
  email: string,
  username: string,
  isAdmin: boolean
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email && !username)
        throw new ThrowError("Please Provide Email or Username", 400);

      const personalAccount = await PersonalAccount.findOne({
        $or: [{ email }, { username }],
      });

      if (personalAccount) {
        if (
          personalAccount.isVerified ||
          (personalAccount.verificationMailSentCount >= 5 && !isAdmin)
        ) {
          throw new ThrowError(
            personalAccount.isVerified
              ? "Already verified"
              : "Mail sent count exceed, contact customer care",
            401
          );
        }

        personalAccount.verificationMailSentCount += 1;
        await personalAccount.save();

        const token: string = await generateToken({
          id: personalAccount._id.toString(),
          name: personalAccount.fname + " " + personalAccount.lname,
          role: "PersonalAccount",
          type: "VerifyToken",
        });

        const VERIFY_URL = CLIENT_DOMAIN + "/personal/verify/" + token;

        sendMail({
          templateId: EMAILJS_VERIFICATION_TEMPLATE_ID,
          templateData: {
            name: `${personalAccount.fname} ${personalAccount.lname}`,
            email: personalAccount.email,
            VERIFY_URL,
          },
        })
          .then()
          .catch();
      }
      resolve({
        message:
          "If your email exist, then the verification link will be sent to your email",
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
 * To verify account using token
 * @param {String} token
 * @returns
 */
export const verifyPersonalAccount = (token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token) throw new ThrowError("Please Provide Token", 400);
      const decoded = (await verifyToken(token, "VerifyToken")).payload;
      if (decoded && decoded.id) {
        const personalAccountFound = await PersonalAccount.findById(decoded.id);

        if (personalAccountFound && !personalAccountFound.isVerified) {
          personalAccountFound.isVerified = true;
          personalAccountFound.verifiedAt = new Date();
          await personalAccountFound.save();
          return resolve({ message: "Personal Account verified Successfully" });
        } else {
          throw new ThrowError("Incorrect Credentials", 401);
        }
      } else {
        throw new ThrowError("Incorrect Credentials", 401);
      }
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
 * To edit a personalAccount
 * @param {String} personalAccountId
 * @param {PersonalAccount} data
 * @returns
 */
export const editPersonalAccount = (
  personalAccountId: string,
  data: any,
  client: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId))
        throw new ThrowError("Provide vaild personalAccount id", 400);

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      const {
        fname,
        lname,
        username,
        phone,
        about,
        socialMediaLinks,
        email,
        password,
      } = data;

      if (username && !username.includes(PERSONAL_ACCOUNT_USERNAME_STARTS_WITH))
        throw new ThrowError("Invalid Username", 404);

      // New username is already exist from anothers
      if (username && personalAccount.username != username) {
        const personalAccountExists = await PersonalAccount.findOne({
          username,
        });
        if (personalAccountExists)
          throw new ThrowError(
            "Username already exist for other personalAccount",
            400
          );
      }

      // New email is already exist from anothers
      if (email && personalAccount.email != email) {
        const personalAccountExists = await PersonalAccount.findOne({
          email,
        });
        if (personalAccountExists)
          throw new ThrowError(
            "Email already exist for other personalAccount",
            400
          );
      }

      // New phone is already exist from anothers
      if (phone && personalAccount.phone != phone) {
        const personalAccountExists = await PersonalAccount.findOne({
          phone,
        });
        if (personalAccountExists)
          throw new ThrowError(
            "Phone already exist for other personalAccount",
            400
          );
      }

      // Update a values in db
      personalAccount.fname = fname || personalAccount.fname;
      personalAccount.lname = lname || personalAccount.lname;
      personalAccount.username = username || personalAccount.username;
      personalAccount.email = email || personalAccount.email;
      personalAccount.phone = phone || personalAccount.phone;
      personalAccount.about = about || personalAccount.about;
      personalAccount.socialMediaLinks =
        socialMediaLinks || personalAccount.socialMediaLinks;

      if (password) {
        personalAccount.password = password;
      }

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: "PersonalAccount edited successfully",
        personalAccount: npersonalAccount,
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
 * To update a personalAccount profile
 * @param {String} personalAccountId
 * @param {PersonalAccount} data
 * @returns
 */
export const updatePersonalAccountProfile = (
  personalAccountId: string,
  data: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId))
        throw new ThrowError("Provide vaild personalAccount id", 400);

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      const { fname, lname, about, socialMediaLinks } = data;

      // Update a values in db
      personalAccount.fname = fname || personalAccount.fname;
      personalAccount.lname = lname || personalAccount.lname;
      personalAccount.about = about || personalAccount.about;
      personalAccount.socialMediaLinks =
        socialMediaLinks || personalAccount.socialMediaLinks;

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: "PersonalAccount profile updated successfully",
        personalAccount: npersonalAccount,
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
 * to change a personalAccount profile pic
 * @param {String} personalAccountId
 * @param {Object} image
 * @returns personalAccount
 */
export const changePersonalAccountProfileImage = (
  personalAccountId: string,
  image: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId) || !image) {
        return reject({
          message: "Provide valid personalAccount id and image",
          statusCode: 400,
        });
      }

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount) {
        return reject({
          message: "Personal Account not found",
          statusCode: 404,
        });
      }

      personalAccount.profilePicture = {
        key: image.key.split("/").slice(-1)[0],
        mimetype: image.mimetype,
      };

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: "Personal Account profile picture changed successfully",
        personalAccount: npersonalAccount,
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
 * to remove a personalAccount profile pic
 * @param {String} personalAccountId
 * @param {Object} image
 * @returns personalAccount
 */
export const removePersonalAccountProfileImage = (
  personalAccountId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId)) {
        return reject({
          message: "Provide valid personalAccount id",
          statusCode: 400,
        });
      }

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount) {
        return reject({
          message: "Personal Account not found",
          statusCode: 404,
        });
      }

      personalAccount.profilePicture = null;

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: "Personal Account profile picture removed successfully",
        personalAccount: npersonalAccount,
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
 * Add a new personalAccount image
 * @param {String} personalAccountId
 * @param {Object} image
 * @returns personalAccount
 */
export const addGalleryImage = (personalAccountId: string, image: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId) || !image) {
        return reject({
          message: "Provide valid personalAccount id and image",
          statusCode: 400,
        });
      }

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount) {
        return reject({
          message: "Personal Account not found",
          statusCode: 404,
        });
      }

      personalAccount.gallerys.push({
        _id: new mongoose.Types.ObjectId().toString(),
        key: image.key.split("/").slice(-1)[0],
        mimetype: image.mimetype,
      });

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: "Personal Account gallery added successfully",
        personalAccount: npersonalAccount,
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
 * Remove a personalAccount image
 * @param {String} personalAccountId
 * @param {String} galleryId
 * @returns personalAccount
 */
export const removeGalleryImage = (
  personalAccountId: string,
  galleryId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !personalAccountId ||
        !isValidObjectId(personalAccountId) ||
        !galleryId ||
        !isValidObjectId(galleryId)
      ) {
        return reject({
          message: "Provide valid personalAccount id and gallery id ",
          statusCode: 400,
        });
      }

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount) {
        return reject({
          message: "Personal Account not found",
          statusCode: 404,
        });
      }

      personalAccount.gallerys = personalAccount.gallerys.filter(
        (gallery) => gallery._id.toString() != galleryId.toString()
      );

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: "Personal Account gallery removed successfully",
        personalAccount: npersonalAccount,
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
 * Remove all image from a personalAccount
 * @param {String} personalAccountId
 * @returns personalAccount
 */
export const removeAllGalleryImages = (personalAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId)) {
        return reject({
          message: "Provide valid personalAccount id",
          statusCode: 400,
        });
      }

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount) {
        return reject({
          message: "Personal Account not found",
          statusCode: 404,
        });
      }

      personalAccount.gallerys = [];

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: "Personal Account gallery images removed successfully",
        personalAccount: npersonalAccount,
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
 * To check the personalAccount status
 * @param {String} personalAccountId
 * @returns {PersonalAccount} personalAccount
 */
export const checkPersonalAccountStatus = (
  personalAccountId: string,
  status: string[]
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      if (
        !personalAccountId ||
        !isValidObjectId(personalAccountId) ||
        status.length <= 0
      )
        throw new ThrowError(
          "Provide vaild personalAccount id and status",
          400
        );

      const personalAccount = await PersonalAccount.findOne({
        _id: personalAccountId,
        isDeleted: false,
      });

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      if (personalAccount.status === "Inactive")
        personalAccount.status = "Active";
      personalAccount.lastUsed = new Date();
      await personalAccount.save();

      if (status.includes(personalAccount.status)) {
        return resolve({
          message: `PersonalAccount is ${personalAccount.status}`,
          personalAccount: {
            id: personalAccount._id,
            name: personalAccount.fname + personalAccount.lname,
            role: "PersonalAccount",
            status: personalAccount.status,
          },
        });
      }
      reject({ message: `PersonalAccount is ${personalAccount.status}` });
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
 * To check availablility for personalAccount's username
 * @param {String} username
 * @returns
 */
export const checkPersonalAccountUsernameAvailability = (username: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!username) throw new ThrowError("Provide username", 400);

      if (!username.includes(PERSONAL_ACCOUNT_USERNAME_STARTS_WITH)) {
        return resolve({
          message: "Username unavailable",
          availability: false,
        });
      }

      const personalAccount = await PersonalAccount.findOne({ username });

      if (!personalAccount) {
        return resolve({ message: "Username available", availability: true });
      } else {
        return resolve({
          message: "Username unavailable",
          availability: false,
        });
      }
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
 * To change personalAccount password
 * @param {String} personalAccountId
 * @param {Passwords} data
 * @returns
 */
export const changePersonalAccountPassword = (
  personalAccountId: string,
  data: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentPassword, password } = data;

      if (
        !personalAccountId ||
        !isValidObjectId(personalAccountId) ||
        !password ||
        !currentPassword
      )
        throw new ThrowError(
          "Provide vaild personalAccount id, currentPassword and password",
          400
        );

      const personalAccount = await PersonalAccount.findOne(
        { _id: personalAccountId },
        { password: 1 }
      );

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      const isMatch = await personalAccount.matchPassword(
        personalAccount.password!
      );
      if (isMatch) {
        personalAccount.password = password;

        await personalAccount.save();

        return resolve({ message: "Password Changed Successfully" });
      } else {
        return reject({ message: "Incorrect Credential" });
      }
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
 * To change a personalAccounts status
 * @param {String} personalAccountId
 * @param {String} status
 * @returns {PersonalAccount} personalAccount
 */
export const changePersonalAccountStatus = (
  personalAccountId: string,
  status: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !personalAccountId ||
        !isValidObjectId(personalAccountId) ||
        !["Active", "Inactive", "Blocked"].includes(status)
      )
        throw new ThrowError(
          "Provide vaild personalAccount id and status",
          404
        );

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      personalAccount.status =
        status === "Active"
          ? "Active"
          : status === "Suspended"
          ? "Suspended"
          : status === "Blocked"
          ? "Blocked"
          : "Inactive";

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: `${
          npersonalAccount.fname + npersonalAccount.lname
        } status changed to ${npersonalAccount.status}`,
        personalAccount: npersonalAccount,
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
 * To change a username for personalAccount
 * @param {String} personalAccountId
 * @param {String} username
 * @returns {PersonalAccount} personalAccount
 */
export const changePersonalAccountUsername = (
  personalAccountId: string,
  username: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !personalAccountId ||
        !isValidObjectId(personalAccountId) ||
        !username
      )
        throw new ThrowError(
          "Provide vaild personalAccount id and username",
          400
        );

      if (!username.includes(PERSONAL_ACCOUNT_USERNAME_STARTS_WITH))
        throw new ThrowError("Invalid Username", 404);

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      if (personalAccount.username === username)
        throw new ThrowError("Old and new username must be different", 400);

      const personalAccountExists = await PersonalAccount.findOne({
        _id: { $ne: personalAccountId },
        username,
        role: "PersonalAccount",
      });
      if (personalAccountExists)
        throw new ThrowError(
          "Username already exist for other personalAccount",
          400
        );

      personalAccount.username = username;

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: `${
          npersonalAccount.fname + npersonalAccount.lname
        }'s username changed to ${npersonalAccount.username}`,
        personalAccount: npersonalAccount,
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
 * To change a email for personalAccount
 * @param {String} personalAccountId
 * @param {String} email
 * @returns {PersonalAccount} personalAccount
 */
export const changePersonalAccountEmail = (
  personalAccountId: string,
  email: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId) || !email)
        throw new ThrowError("Provide vaild personalAccount id and email", 400);

      const personalAccount = await PersonalAccount.findById(personalAccountId);

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      if (personalAccount.email === email)
        throw new ThrowError("Old and new email must be different", 400);

      const personalAccountExists = await PersonalAccount.findOne({
        _id: { $ne: personalAccountId },
        email,
        role: "PersonalAccount",
      });
      if (personalAccountExists)
        throw new ThrowError(
          "Email already exist for other personalAccount",
          400
        );

      personalAccount.email = email;

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: `${
          npersonalAccount.fname + npersonalAccount.lname
        }'s email changed to ${npersonalAccount.email}`,
        personalAccount: npersonalAccount,
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
 * To change a phone for personalAccount
 * @param {String} personalAccountId
 * @param {String} phone
 * @returns {PersonalAccount} personalAccount
 */
export const changePersonalAccountPhone = (
  personalAccountId: string,
  phone: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId) || !phone) {
        return reject({
          message: "Provide vaild personalAccount id and phone",
          statusCode: 404,
        });
      }

      const personalAccount = await PersonalAccount.findById(personalAccountId);
      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      if (personalAccount.phone === phone)
        throw new ThrowError("Old and new phone must be different", 400);

      const personalAccountExists = await PersonalAccount.findOne({
        _id: { $ne: personalAccountId },
        phone,
        role: "PersonalAccount",
      });
      if (personalAccountExists)
        throw new ThrowError(
          "Phone number already exist for other personalAccount",
          400
        );

      personalAccount.phone = phone;

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: `${
          npersonalAccount.fname + npersonalAccount.lname
        }'s phone changed to ${npersonalAccount.phone}`,
        personalAccount: npersonalAccount,
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
 * To send a reset link to email
 * @param {String} email
 * @returns
 */
export const forgotPersonalAccountPassword = (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) throw new ThrowError("Please Provide Email", 400);

      const personalAccount = await PersonalAccount.findOne({ email });
      let token: string = "";
      if (personalAccount) {
        personalAccount.resetPasswordAccess = true;
        await personalAccount.save();

        token = await generateToken({
          id: personalAccount._id.toString(),
          name: personalAccount.fname + personalAccount.lname,
          role: "PersonalAccount",
          type: "ResetToken",
        });

        const VERIFY_URL = CLIENT_DOMAIN + "/personal/reset/" + token;

        sendMail({
          templateId: EMAILJS_RESET_TEMPLATE_ID,
          templateData: {
            name: `${personalAccount.fname} ${personalAccount.lname}`,
            email: personalAccount.email,
            VERIFY_URL,
          },
        })
          .then()
          .catch();
      }
      resolve({
        message:
          "If your email exist,then the Password reset link will be sent to your email" +
          token,
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
 * To reset a password using token
 * @param {String} token
 * @param {String} password
 * @returns
 */
export const resetPersonalAccountPassword = (
  token: string,
  password: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token || !password)
        throw new ThrowError("Please Provide Token and Password", 400);
      const decoded = await verifyToken(token, "ResetToken");

      if (decoded && decoded.id) {
        const personalAccountFound = await PersonalAccount.findOne(
          {
            _id: decoded.id,
            resetPasswordAccess: true,
          },
          {
            password: 1,
            resetPasswordAccess: 1,
          }
        );
        if (personalAccountFound) {
          const isMatch = await personalAccountFound.matchPassword(password);
          if (isMatch) {
            throw new ThrowError("New Pasword and Old Password is Same", 400);
          } else {
            personalAccountFound.password = password;
            personalAccountFound.resetPasswordAccess = false;
            await personalAccountFound.save();
            return resolve({ message: "Password Reset Successfully" });
          }
        } else {
          throw new ThrowError("Reset Password Permission Denied", 401);
        }
      } else {
        throw new ThrowError("Incorrect Credentials", 401);
      }
    } catch (error: any) {
      console.log(error);
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete a non deleted personalAccount temporarily
 * @param {String} personalAccountId
 */
export const deletePersonalAccount = (personalAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId))
        throw new ThrowError("Provide valid personalAccount id", 400);

      const personalAccount = await PersonalAccount.findOne({
        _id: personalAccountId,
        isDeleted: false,
      });

      if (!personalAccount)
        throw new ThrowError("PersonalAccount not found", 404);

      personalAccount.status = "Inactive";
      personalAccount.isDeleted = true;
      personalAccount.deletedAt = new Date();

      await personalAccount.save();

      resolve({
        message: `${
          personalAccount.fname + personalAccount.lname
        } personalAccount was deleted`,
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
 * To restore a deleted personalAccount
 * @param {String} personalAccountId
 * @returns personalAccount
 */
export const restorePersonalAccount = (personalAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId))
        throw new ThrowError("Provide valid personalAccount id", 400);

      const personalAccount = await PersonalAccount.findOne({
        _id: personalAccountId,
        isDeleted: true,
      });

      if (!personalAccount) {
        return reject({
          message: "PersonalAccount not found",
          statusCode: 404,
        });
      }

      personalAccount.status = "Active";
      personalAccount.isDeleted = false;
      personalAccount.deletedAt = undefined;

      const npersonalAccount = await personalAccount.save();

      resolve({
        message: `${
          npersonalAccount.fname + npersonalAccount.lname
        } personalAccount was restored`,
        personalAccount: npersonalAccount,
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
 * To delete a personalAccount permanently
 * @param {String} personalAccountId
 */
export const pDeletePersonalAccount = (personalAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!personalAccountId || !isValidObjectId(personalAccountId))
        throw new ThrowError("Provide valid personalAccount id", 400);

      const personalAccount = await PersonalAccount.findOne({
        _id: personalAccountId,
        isDeleted: true,
      });

      if (!personalAccount) {
        return reject({
          message: "PersonalAccount not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await personalAccount.deleteOne();
        return resolve({
          message: `${
            personalAccount.fname + personalAccount.lname
          } personalAccount was deleted`,
        });
      }
      throw new ThrowError(
        `Not able to delete personalAccount in ${NODE_ENV} mode`,
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
 * To delete all personalAccount in development mode
 */
export const deleteAllPersonalAccount = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await PersonalAccount.deleteMany({});
        return resolve({ message: "All personalAccount deleted" });
      }
      throw new ThrowError(
        `Not able to delete all personalAccounts in ${NODE_ENV} mode`,
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
