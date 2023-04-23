import mongoose from "mongoose";
import { config } from "../config/index.js";
import { User } from "../models";
import { generateToken, verifyToken } from "../utils";
import { ThrowError } from "../classes";
import { IRoles } from "../types/default.js";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;

/**
 * To get all users
 * @returns {Users} users
 */
export const getUsers = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperUser", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const users = await User.find({ ...query }).sort({ createdAt: -1 });

      resolve({
        message: "Users Fetched",
        users,
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
 * To get a particular user by id
 * @param {String} userId
 * @returns {User} user
 */
export const getUser = (userId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError("Provide vaild user id", 404);

      const query = ["SuperUser", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const user = await User.findOne({ _id: userId, ...query });

      if (!user) {
        return reject({
          message: "User not found",
          statusCode: 404,
        });
      }
      resolve({ message: "User fetched", user });
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
 * To login a user's account by email and password
 * @param {String} email
 * @param {String} phone
 * @param {String} password
 * @returns {String} token
 */
export const userLogin = (email: string, phone: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((!email && !phone) || !password)
        throw new ThrowError("Provide email and password", 400);

      const user = await User.findOne(
        { $or: [{ email }, { phone }] },
        { password: 1, name: 1, role: 1, status: 1, lastSync: 1 }
      );

      if (!user)
        throw new ThrowError(
          `Invalid ${!email ? "Phone" : "Email"} or Password`,
          400
        );
      if (user.status === "Blocked")
        throw new ThrowError(`Account blocked! contact Customer Care`, 401);

      if (user && (await user.matchPassword(password))) {
        if (user.status === "Inactive") user.status = "Active";
        user.lastSync = new Date();
        await user.save();

        const token = await generateToken({
          id: user._id.toString(),
          name: `${user.fname} ${user.lname}`,
          role: user.type === "Personal" ? "PersonalUser" : "BusinessUser",
          type: "AccessToken",
        });
        resolve({
          message: "Login Success",
          token,
        });
      } else {
        throw new ThrowError(
          `Invalid ${!email ? "Phone" : "Email"} or Password`,
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
 * To add a new user
 * @param {User} data
 * @returns user
 */
export const addUser = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        fname,
        lname,
        type,
        email,
        phone,
        password,
        companyName,
        companyCategory,
        companyPhone,
        companyWebsite,
        companyLocation,
        companyState,
        companyCity,
        companyAddress,
      } = data;
      if (
        !fname ||
        !lname ||
        !type ||
        !email ||
        !phone ||
        !password ||
        (type === "Business" &&
          (!companyName ||
            !companyCategory ||
            !isValidObjectId(companyCategory) ||
            !companyPhone ||
            !companyWebsite ||
            !companyLocation ||
            !companyState ||
            !companyCity ||
            !companyAddress))
      )
        throw new ThrowError(
          `Please Provide fname, lname, email, type, phone ${
            type === "Business"
              ? "companyName, valid companyCategory, companyPhone, companyWebsite, companyLocation, companyState, companyCity, companyAddress and"
              : "and"
          } password`,
          400
        );

      const userExists = await User.findOne({
        $or: [{ email }, { phone }],
        type,
      });

      if (userExists) throw new ThrowError("User already exist!", 401);

      const user = await new User({
        fname,
        lname,
        email,
        phone,
        type,
        password,
        lastSync: new Date(),
        lastUsed: new Date(),
      });

      if (user.type === "Business") {
        user.companyDetails = {
          companyName,
          companyCategory,
          companyPhone,
          companyWebsite,
          companyLocation,
          companyState,
          companyCity,
          companyAddress,
        };
      }

      const nuser = await user.save();

      resolve({ message: "Account created successfully", user: nuser });
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
 * To edit a user
 * @param {String} userId
 * @param {User} data
 * @returns
 */
export const editUser = (userId: string, data: any, client: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError("Provide vaild user id", 400);

      const user = await User.findById(userId);

      if (!user) throw new ThrowError("User not found", 404);

      const {
        fname,
        lname,
        username,
        email,
        phone,
        password,
        companyName,
        companyCategory,
        companyPhone,
        companyWebsite,
        companyLocation,
        companyState,
        companyCity,
        companyAddress,
      } = data;

      // New email is already exist from another user then
      if (email && user.email != email) {
        const userExists = await User.findOne({
          email,
          type: user.type,
        });
        if (userExists)
          throw new ThrowError("Email already exist for other user", 400);
      }

      // New phone is already exist from another user then
      if (phone && user.phone != phone) {
        const userExists = await User.findOne({
          phone,
          type: user.type,
        });
        if (userExists)
          throw new ThrowError("Phone already exist for other user", 400);
      }

      // New username is already exist from another user then
      if (username && user.username != username) {
        const userExists = await User.findOne({
          username,
          type: user.type,
        });
        if (userExists)
          throw new ThrowError("Username already exist for other user", 400);
      }

      // Update a values in db
      user.fname = fname || user.fname;
      user.lname = lname || user.lname;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      if (user.type === "Business") {
        user.companyDetails!.companyName =
          companyName || user.companyDetails!.companyName;
        user.companyDetails!.companyCategory =
          companyCategory || user.companyDetails!.companyCategory;
        user.companyDetails!.companyPhone =
          companyPhone || user.companyDetails!.companyPhone;
        user.companyDetails!.companyWebsite =
          companyWebsite || user.companyDetails!.companyWebsite;
        user.companyDetails!.companyLocation =
          companyLocation || user.companyDetails!.companyLocation;
        user.companyDetails!.companyState =
          companyState || user.companyDetails!.companyState;
        user.companyDetails!.companyCity =
          companyCity || user.companyDetails!.companyCity;
        user.companyDetails!.companyAddress =
          companyAddress || user.companyDetails!.companyAddress;
      }

      if (password) {
        user.password = password;
      }

      const nuser = await user.save();

      resolve({ message: "User edited successfully", user: nuser });
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
 * To update a user profile
 * @param {String} userId
 * @param {User} data
 * @returns
 */
export const updateUserProfile = (userId: string, data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError("Provide vaild user id", 400);

      const user = await User.findById(userId);

      if (!user) throw new ThrowError("User not found", 404);

      const {
        fname,
        lname,
        companyName,
        companyCategory,
        companyPhone,
        companyWebsite,
        companyLocation,
        companyState,
        companyCity,
        companyAddress,
      } = data;

      // Update a values in db
      user.fname = fname || user.fname;
      user.lname = lname || user.lname;
      if (user.type === "Business") {
        user.companyDetails!.companyName =
          companyName || user.companyDetails!.companyName;
        user.companyDetails!.companyCategory =
          companyCategory || user.companyDetails!.companyCategory;
        user.companyDetails!.companyPhone =
          companyPhone || user.companyDetails!.companyPhone;
        user.companyDetails!.companyWebsite =
          companyWebsite || user.companyDetails!.companyWebsite;
        user.companyDetails!.companyLocation =
          companyLocation || user.companyDetails!.companyLocation;
        user.companyDetails!.companyState =
          companyState || user.companyDetails!.companyState;
        user.companyDetails!.companyCity =
          companyCity || user.companyDetails!.companyCity;
        user.companyDetails!.companyAddress =
          companyAddress || user.companyDetails!.companyAddress;
      }

      const nuser = await user.save();

      resolve({ message: "User profile updated successfully", user: nuser });
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
 * To check the user status
 * @param {String} userId
 * @returns {User} user
 */
export const checkUserStatus = (userId: string, status: string[]) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId) || status.length <= 0)
        throw new ThrowError("Provide vaild user id and status", 400);

      const user = await User.findOne({ _id: userId, isDeleted: false });

      if (!user) throw new ThrowError("User not found", 404);

      if (user.status === "Inactive") user.status = "Active";
      user.lastUsed = new Date();
      await user.save();

      if (status.includes(user.status)) {
        return resolve({
          message: `User is ${user.status}`,
          user: {
            id: user._id,
            name: `${user.fname} ${user.lname}`,
            role: user.type === "Personal" ? "PersonalUser" : "BusinessUser",
            status: user.status,
          },
        });
      }
      reject({ message: `User is ${user.status}` });
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
 * To change user password
 * @param {String} userId
 * @param {Passwords} data
 * @returns
 */
export const changeUserPassword = (userId: string, data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentPassword, password } = data;

      if (!userId || !isValidObjectId(userId) || !password || !currentPassword)
        throw new ThrowError(
          "Provide vaild user id, currentPassword and password",
          400
        );

      const user = await User.findOne({ _id: userId }, { password: 1 });

      if (!user) throw new ThrowError("User not found", 404);

      const isMatch = await user.matchPassword(user.password!);
      if (isMatch) {
        user.password = password;

        await user.save();

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
 * To change a users status
 * @param {String} userId
 * @param {String} status
 * @returns {User} user
 */
export const changeUserStatus = (userId: string, status: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !userId ||
        !isValidObjectId(userId) ||
        !["Active", "Inactive", "Blocked"].includes(status)
      )
        throw new ThrowError("Provide vaild user id and status", 404);

      const user = await User.findById(userId);

      if (!user) throw new ThrowError("User not found", 404);

      user.status =
        status === "Active"
          ? "Active"
          : status === "Suspended"
          ? "Suspended"
          : status === "Blocked"
          ? "Blocked"
          : "Inactive";

      const nuser = await user.save();

      resolve({
        message: `${nuser.fname} ${nuser.lname} status changed to ${nuser.status}`,
        user: nuser,
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
 * To change a email for user
 * @param {String} userId
 * @param {String} email
 * @returns {User} user
 */
export const changeUserEmail = (userId: string, email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId) || !email)
        throw new ThrowError("Provide vaild user id and email", 400);

      const user = await User.findById(userId);

      if (!user) throw new ThrowError("User not found", 404);

      if (user.email === email)
        throw new ThrowError("Old and new email must be different", 400);

      const userExists = await User.findOne({
        _id: { $ne: userId },
        email,
        role: user.type === "Personal" ? "PersonalUser" : "BusinessUser",
      });
      if (userExists)
        throw new ThrowError("Email already exist for other user", 400);

      user.email = email;

      const nuser = await user.save();

      resolve({
        message: `${nuser.fname} ${nuser.lname}'s email changed to ${nuser.email}`,
        user: nuser,
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
 * To change a phone for user
 * @param {String} userId
 * @param {String} phone
 * @returns {User} user
 */
export const changeUserPhone = (userId: string, phone: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId) || !phone) {
        return reject({
          message: "Provide vaild user id and phone",
          statusCode: 404,
        });
      }

      const user = await User.findById(userId);
      if (!user) throw new ThrowError("User not found", 404);

      if (user.phone === phone)
        throw new ThrowError("Old and new phone must be different", 400);

      const userExists = await User.findOne({
        _id: { $ne: userId },
        phone,
        role: user.type === "Personal" ? "PersonalUser" : "BusinessUser",
      });
      if (userExists)
        throw new ThrowError("Phone number already exist for other user", 400);

      user.phone = phone;

      const nuser = await user.save();

      resolve({
        message: `${nuser.fname} ${nuser.lname}'s phone changed to ${nuser.phone}`,
        user: nuser,
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
 * To change a username for user
 * @param {String} userId
 * @param {String} username
 * @returns {User} user
 */
export const changeUsername = (userId: string, username: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId) || !username) {
        return reject({
          message: "Provide vaild user id and username",
          statusCode: 404,
        });
      }

      const user = await User.findById(userId);
      if (!user) throw new ThrowError("User not found", 404);

      if (user.username === username)
        throw new ThrowError("Old and new username must be different", 400);

      const userExists = await User.findOne({
        _id: { $ne: userId },
        username,
        type: user.type,
      });
      if (userExists) throw new ThrowError("UserName not available", 400);

      user.username = username;

      const nuser = await user.save();

      resolve({
        message: `${nuser.fname} ${nuser.lname}'s username changed to ${nuser.username}`,
        user: nuser,
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
export const forgotUserPassword = (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) throw new ThrowError("Please Provide Email", 400);

      const user = await User.findOne({ email });
      let token: string = "";
      if (user) {
        user.resetPasswordAccess = true;
        await user.save();

        token = await generateToken({
          id: user._id.toString(),
          name: user.fname + user.lname,
          role: user.type === "Personal" ? "PersonalUser" : "BusinessUser",
          type: "ResetToken",
        });

        // await sendMail("ResetPassword", {
        //   token,
        //   name: `${user.fname} ${user.lname}`,
        //   email: user.email,
        // })
        //   .then()
        //   .catch();
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
export const resetUserPassword = (token: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token || !password)
        throw new ThrowError("Please Provide Token and Password", 400);
      const decoded = await verifyToken(token, "ResetToken");

      if (decoded && decoded.id) {
        const userFound = await User.findOne(
          {
            _id: decoded.id,
            resetPasswordAccess: true,
          },
          {
            password: 1,
            resetPasswordAccess: 1,
          }
        );
        if (userFound) {
          const isMatch = await userFound.matchPassword(password);
          if (isMatch) {
            throw new ThrowError("New Pasword and Old Password is Same", 400);
          } else {
            userFound.password = password;
            userFound.resetPasswordAccess = false;
            await userFound.save();
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
 * To delete a non deleted user temporarily
 * @param {String} userId
 */
export const deleteUser = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError("Provide valid user id", 400);

      const user = await User.findOne({
        _id: userId,
        isDeleted: false,
      });

      if (!user) throw new ThrowError("User not found", 404);

      user.status = "Inactive";
      user.isDeleted = true;
      user.deletedAt = new Date();

      await user.save();

      resolve({
        message: `${user.fname} ${user.lname} user was deleted`,
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
 * To restore a deleted user
 * @param {String} userId
 * @returns user
 */
export const restoreUser = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError("Provide valid user id", 400);

      const user = await User.findOne({
        _id: userId,
        isDeleted: true,
      });

      if (!user) {
        return reject({
          message: "User not found",
          statusCode: 404,
        });
      }

      user.status = "Active";
      user.isDeleted = false;
      user.deletedAt = undefined;

      const nuser = await user.save();

      resolve({
        message: `${nuser.fname} ${nuser.lname} user was restored`,
        user: nuser,
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
 * To delete a user permanently
 * @param {String} userId
 */
export const pDeleteUser = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError("Provide valid user id", 400);

      const user = await User.findOne({
        _id: userId,
        isDeleted: true,
      });

      if (!user) {
        return reject({
          message: "User not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await user.deleteOne();
        return resolve({
          message: `${user.fname} ${user.lname} user was deleted`,
        });
      }
      throw new ThrowError(`Not able to delete user in ${NODE_ENV} mode`, 401);
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
 * To delete all user in development mode
 */
export const deleteAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await User.deleteMany({});
        return resolve({ message: "All user deleted" });
      }
      throw new ThrowError(
        `Not able to delete all users in ${NODE_ENV} mode`,
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
