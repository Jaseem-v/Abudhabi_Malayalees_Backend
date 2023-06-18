import mongoose from "mongoose";
import { config } from "../../config/index";
import { BusinessAccount } from "../../models/index";
import { generateToken, verifyToken } from "../../utils/index";
import { ThrowError } from "../../classes/index";
import { IRoles } from "../../types/default";
import { sendMail } from "../../functions";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;
const { CLIENT_DOMAIN } = config.CLIENT;
const { EMAILJS_VERIFICATION_TEMPLATE_ID, EMAILJS_RESET_TEMPLATE_ID } =
  config.EMAILJS;

const BUSINESS_ACCOUNT_USERNAME_STARTS_WITH = "ba-";

/**
 * To get all businessAccounts
 * @returns {BusinessAccounts} businessAccounts
 */
export const getBusinessAccounts = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? {}
        : { isDeleted: false };
      const businessAccounts = await BusinessAccount.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: "BusinessAccounts Fetched",
        businessAccounts,
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
 * To get all verified businessAccounts
 * @returns {BusinessAccounts} businessAccounts
 */
export const getVerifiedBusinessAccounts = (search: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const searchQuery =
        search.trim().length > 0
          ? { name: { $regex: search.toLowerCase, $options: "i" } }
          : {};
      const businessAccounts = await BusinessAccount.find({
        isVerified: true,
        ...searchQuery,
      }).sort({ name: 1 });

      resolve({
        message: "BusinessAccounts Fetched",
        businessAccounts,
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
 * To get a particular businessAccount by id
 * @param {String} businessAccountId
 * @returns {BusinessAccount} businessAccount
 */
export const getBusinessAccount = (
  businessAccountId: string,
  role?: IRoles
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId))
        throw new ThrowError("Provide vaild businessAccount id", 404);

      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? {}
        : { isDeleted: false };
      const businessAccount = await BusinessAccount.findOne({
        _id: businessAccountId,
        ...query,
      });

      if (!businessAccount) {
        return reject({
          message: "BusinessAccount not found",
          statusCode: 404,
        });
      }
      resolve({ message: "BusinessAccount fetched", businessAccount });
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
 * To login a businessAccount's account by email and password
 * @param {String} username
 * @param {String} email
 * @param {String} phone
 * @param {String} password
 * @returns {String} token
 */
export const businessAccountLogin = (
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

      const businessAccount = await BusinessAccount.findOne(
        { $or: [{ username }, { email }, { phone }] },
        { password: 1, name: 1, role: 1, status: 1, lastSync: 1, isVerified: 1 }
      );

      if (!businessAccount)
        throw new ThrowError(
          `Invalid ${
            username ? "Username" : phone ? "Phone" : "Email"
          } or Password`,
          400
        );
      if (businessAccount.status === "Blocked")
        throw new ThrowError(`Account blocked! contact Customer Care`, 401);

      if (businessAccount && (await businessAccount.matchPassword(password))) {
        if (!businessAccount.isVerified)
          throw new ThrowError(`Verify your account`, 401);
        if (businessAccount.status === "Inactive")
          businessAccount.status = "Active";
        businessAccount.lastSync = new Date();
        await businessAccount.save();

        const token = await generateToken({
          id: businessAccount._id.toString(),
          name: businessAccount.name,
          role: "BusinessAccount",
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
 * To add a new businessAccount
 * @param {BusinessAccount} data
 * @returns businessAccount
 */
export const addBusinessAccount = (data: any, adminId?: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        username,
        phone,
        email,
        password,
        category,
        website,
        location,
        about,
        socialMediaLinks,
        locationType,
        numberOfEmployees,
        yearEstablished,
        services,
        addressDetails,
        contactDetails,
      } = data;

      if (
        !name ||
        !username ||
        !phone ||
        !email ||
        !password ||
        !category ||
        !addressDetails ||
        !addressDetails.state ||
        !addressDetails.city ||
        !addressDetails.address ||
        !addressDetails.pincode


    
    
      )
        throw new ThrowError(
          `Please Provide name(*), username(*), phone(*), email(*), password(*), category(*), website, location, services, about, socialMediaLinks, addressDetails(streetNumber, state(*), city(*), address(*), place, pincode(*) and landmark) and contactDetails (fname, lname, email, phone, isAddressVisible, addressDetails (streetNumber, state, city, address, place, pincode and landmark))`,
          400
        );

      if (username && !username.includes(BUSINESS_ACCOUNT_USERNAME_STARTS_WITH))
        throw new ThrowError("Invalid Username", 404);

      const businessAccountExists = await BusinessAccount.findOne({
        $or: [
          { email },
          { phone },
          { username },
          // { "contactDetails.email": contactDetails.email },
          // { "contactDetails.phone": contactDetails.phone },
        ],
        isDeleted: false
      });

      if (businessAccountExists)
        throw new ThrowError("BusinessAccount already exist!", 401);

      const businessAccount = await new BusinessAccount({
        name,
        username,
        phone,
        email,
        password,
        isVerified: typeof adminId === "string",
        verifiedAt: typeof adminId === "string" ? new Date() : null,
        verificationMailSentCount: 0,
        category,
        website,
        location,
        services: services ?? [],
        about,
        socialMediaLinks,
        locationType,
        numberOfEmployees,
        yearEstablished,
        addressDetails: {
          streetNumber: addressDetails?.streetNumber,
          state: addressDetails?.state,
          city: addressDetails?.city,
          address: addressDetails?.address,
          place: addressDetails?.place,
          pincode: addressDetails?.pincode,
          landmark: addressDetails?.landmark,
        },
        contactDetails: {
          fname: contactDetails?.fname,
          lname: contactDetails?.lname,
          email: contactDetails?.email,
          phone: contactDetails?.phone,
          isAddressVisible: contactDetails?.isAddressVisible,
          addressDetails: {
            streetNumber: contactDetails.addressDetails?.streetNumber,
            state: contactDetails.addressDetails?.state,
            city: contactDetails.addressDetails?.city,
            address: contactDetails.addressDetails?.address,
            place: contactDetails.addressDetails?.place,
            pincode: contactDetails.addressDetails?.pincode,
            landmark: contactDetails.addressDetails?.landmark,
          },
        },
        profilePicture: null,
        gallerys: [],
        lastSync: new Date(),
        lastUsed: new Date(),
        manual: typeof adminId === "string",
        createdBy: adminId,
      });

      const nbusinessAccount = await businessAccount.save();

      if (typeof adminId != "string") {
        sendVerificationMailBusinessAccount(
          businessAccount.email,
          businessAccount.username,
          false
        )
          .then()
          .catch((error: any) => console.log(error.message));
      }

      resolve({
        message: "Business Account created successfully",
        businessAccount: nbusinessAccount,
      });
    } catch (error: any) {
      console.log(error);
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
export const sendVerificationMailBusinessAccount = (
  email: string,
  username: string,
  isAdmin: boolean
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email && !username)
        throw new ThrowError("Please Provide Email or Username", 400);

      const businessAccount = await BusinessAccount.findOne({
        $or: [{ email }, { username }],
      });

      if (businessAccount) {
        if (
          businessAccount.isVerified ||
          (businessAccount.verificationMailSentCount >= 5 && !isAdmin)
        ) {
          throw new ThrowError(
            businessAccount.isVerified
              ? "Already verified"
              : "Mail sent count exceed, contact customer care",
            401
          );
        }

        businessAccount.verificationMailSentCount += 1;
        await businessAccount.save();

        const token: string = await generateToken({
          id: businessAccount._id.toString(),
          name: businessAccount.name,
          role: "BusinessAccount",
          type: "VerifyToken",
        });

        const VERIFY_URL = CLIENT_DOMAIN + "/business/verify/" + token;

        sendMail({
          templateId: EMAILJS_VERIFICATION_TEMPLATE_ID,
          templateData: {
            name: businessAccount.name,
            email: businessAccount.email,
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
export const verifyBusinessAccount = (token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token) throw new ThrowError("Please Provide Token", 400);
      const decoded = (await verifyToken(token, "VerifyToken")).payload;
      if (decoded && decoded.id) {
        const businessAccountFound = await BusinessAccount.findById(decoded.id);

        if (businessAccountFound && !businessAccountFound.isVerified) {
          businessAccountFound.isVerified = true;
          businessAccountFound.verifiedAt = new Date();
          await businessAccountFound.save();
          return resolve({ message: "Business Account verified Successfully" });
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
 * To edit a businessAccount
 * @param {String} businessAccountId
 * @param {BusinessAccount} data
 * @returns
 */
export const editBusinessAccount = (
  businessAccountId: string,
  data: any,
  client: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId))
        throw new ThrowError("Provide vaild businessAccount id", 400);

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      const {
        name,
        username,
        phone,
        email,
        password,
        category,
        website,
        location,
        services,
        socialMediaLinks,
        addressDetails,
        contactDetails,
        locationType,
        numberOfEmployees,
        yearEstablished,
      } = data;

      if (username && !username.includes(BUSINESS_ACCOUNT_USERNAME_STARTS_WITH))
        throw new ThrowError("Invalid Username", 404);

      // New username is already exist from anothers
      if (username && businessAccount.username != username) {
        const businessAccountExists = await BusinessAccount.findOne({
          username,
        });
        if (businessAccountExists)
          throw new ThrowError(
            "Username already exist for other businessAccount",
            400
          );
      }

      // New email is already exist from anothers
      if (email && businessAccount.email != email) {
        const businessAccountExists = await BusinessAccount.findOne({
          email,
        });
        if (businessAccountExists)
          throw new ThrowError(
            "Email already exist for other businessAccount",
            400
          );
      }

      // New phone is already exist from anothers
      if (phone && businessAccount.phone != phone) {
        const businessAccountExists = await BusinessAccount.findOne({
          phone,
        });
        if (businessAccountExists)
          throw new ThrowError(
            "Phone already exist for other businessAccount",
            400
          );
      }

      // New contact details phone is already exist from anothers
      // if (
      //   contactDetails && contactDetails.phone &&
      //   businessAccount.contactDetails.phone != contactDetails.phone
      // ) {
      //   const businessAccountExists = await BusinessAccount.findOne({
      //     "contactDetails.phone": contactDetails.phone,
      //   });
      //   if (businessAccountExists)
      //     throw new ThrowError(
      //       "contactDetail's phone already exist for other businessAccount",
      //       400
      //     );
      // }

      // Update a values in db
      businessAccount.name = name || businessAccount.name;
      businessAccount.username = username || businessAccount.username;
      businessAccount.email = email || businessAccount.email;
      businessAccount.phone = phone || businessAccount.phone;
      businessAccount.website = website || businessAccount.website;
      businessAccount.location = location || businessAccount.location;
      businessAccount.socialMediaLinks =
        socialMediaLinks || businessAccount.socialMediaLinks;
      businessAccount.services = services || businessAccount.services;
      businessAccount.locationType = locationType || businessAccount.locationType;
      businessAccount.numberOfEmployees = numberOfEmployees || businessAccount.numberOfEmployees;
      businessAccount.yearEstablished = yearEstablished || businessAccount.yearEstablished;

      if (category && isValidObjectId(category)) {
        businessAccount.category = category;
      }
      if (password) {
        businessAccount.password = password;
      }

      if (addressDetails) {
        if (addressDetails.streetNumber) {
          businessAccount.addressDetails.streetNumber =
            addressDetails.streetNumber;
        }
        if (addressDetails.state) {
          businessAccount.addressDetails.state = addressDetails.state;
        }
        if (addressDetails.city) {
          businessAccount.addressDetails.city = addressDetails.city;
        }
        if (addressDetails.address) {
          businessAccount.addressDetails.address = addressDetails.address;
        }
        if (addressDetails.place) {
          businessAccount.addressDetails.place = addressDetails.place;
        }
        if (addressDetails.pincode) {
          businessAccount.addressDetails.pincode = addressDetails.pincode;
        }
        if (addressDetails.landmark) {
          businessAccount.addressDetails.landmark = addressDetails.landmark;
        }
      }

      if (contactDetails) {
        if (contactDetails.fname) {
          businessAccount.contactDetails.fname = contactDetails.fname;
        }
        if (contactDetails.lname) {
          businessAccount.contactDetails.lname = contactDetails.lname;
        }
        if (contactDetails.email) {
          businessAccount.contactDetails.email = contactDetails.email;
        }
        if (contactDetails.phone) {
          businessAccount.contactDetails.phone = contactDetails.phone;
        }
        if (contactDetails.isAddressVisible) {
          businessAccount.contactDetails.isAddressVisible =
            contactDetails.isAddressVisible;
        }
        if (contactDetails.addressDetails) {
          if (contactDetails.addressDetails.streetNumber) {
            businessAccount.contactDetails.addressDetails.streetNumber =
              contactDetails.addressDetails.streetNumber;
          }
          if (contactDetails.addressDetails.state) {
            businessAccount.contactDetails.addressDetails.state =
              contactDetails.addressDetails.state;
          }
          if (contactDetails.addressDetails.city) {
            businessAccount.contactDetails.addressDetails.city =
              contactDetails.addressDetails.city;
          }
          if (contactDetails.addressDetails.address) {
            businessAccount.contactDetails.addressDetails.address =
              contactDetails.addressDetails.address;
          }
          if (contactDetails.addressDetails.place) {
            businessAccount.contactDetails.addressDetails.place =
              contactDetails.addressDetails.place;
          }
          if (contactDetails.addressDetails.pincode) {
            businessAccount.contactDetails.addressDetails.pincode =
              contactDetails.addressDetails.pincode;
          }
          if (contactDetails.addressDetails.landmark) {
            businessAccount.contactDetails.addressDetails.landmark =
              contactDetails.addressDetails.landmark;
          }
        }
      }

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: "BusinessAccount edited successfully",
        businessAccount: nbusinessAccount,
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
 * To update a businessAccount profile
 * @param {String} businessAccountId
 * @param {BusinessAccount} data
 * @returns
 */
export const updateBusinessAccountProfile = (
  businessAccountId: string,
  data: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId))
        throw new ThrowError("Provide vaild businessAccount id", 400);

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      const {
        name,
        category,
        website,
        location,
        about,
        services,
        socialMediaLinks,
        addressDetails,
        contactDetails,
        locationType,
        numberOfEmployees,
        yearEstablished,
      } = data;

      // New contact details phone is already exist from anothers
      if (
        contactDetails &&
        contactDetails.phone &&
        businessAccount.contactDetails.phone != contactDetails.phone
      ) {
        const businessAccountExists = await BusinessAccount.findOne({
          "contactDetails.phone": contactDetails.phone,
        });
        if (businessAccountExists)
          throw new ThrowError(
            "contactDetail's phone already exist for other businessAccount",
            400
          );
      }

      // Update a values in db
      businessAccount.name = name || businessAccount.name;
      businessAccount.website = website || businessAccount.website;
      businessAccount.location = location || businessAccount.location;
      businessAccount.about = about || businessAccount.about;
      businessAccount.services = services || businessAccount.services;
      businessAccount.locationType = locationType || businessAccount.locationType;
      businessAccount.numberOfEmployees = numberOfEmployees || businessAccount.numberOfEmployees;
      businessAccount.yearEstablished = yearEstablished || businessAccount.yearEstablished;
      businessAccount.socialMediaLinks =
        socialMediaLinks || businessAccount.socialMediaLinks;

      if (category && isValidObjectId(category)) {
        businessAccount.category = category;
      }

      if (addressDetails) {
        if (addressDetails.streetNumber) {
          businessAccount.addressDetails.streetNumber =
            addressDetails.streetNumber;
        }
        if (addressDetails.state) {
          businessAccount.addressDetails.state = addressDetails.state;
        }
        if (addressDetails.city) {
          businessAccount.addressDetails.city = addressDetails.city;
        }
        if (addressDetails.address) {
          businessAccount.addressDetails.address = addressDetails.address;
        }
        if (addressDetails.place) {
          businessAccount.addressDetails.place = addressDetails.place;
        }
        if (addressDetails.pincode) {
          businessAccount.addressDetails.pincode = addressDetails.pincode;
        }
        if (addressDetails.landmark) {
          businessAccount.addressDetails.landmark = addressDetails.landmark;
        }
      }

      if (contactDetails) {
        if (contactDetails.fname) {
          businessAccount.contactDetails.fname = contactDetails.fname;
        }
        if (contactDetails.lname) {
          businessAccount.contactDetails.lname = contactDetails.lname;
        }
        if (contactDetails.email) {
          businessAccount.contactDetails.email = contactDetails.email;
        }
        if (contactDetails.phone) {
          businessAccount.contactDetails.phone = contactDetails.phone;
        }
        if (contactDetails.isAddressVisible) {
          businessAccount.contactDetails.isAddressVisible =
            contactDetails.isAddressVisible;
        }
        if (contactDetails.addressDetails) {
          if (contactDetails.addressDetails.streetNumber) {
            businessAccount.contactDetails.addressDetails.streetNumber =
              contactDetails.addressDetails.streetNumber;
          }
          if (contactDetails.addressDetails.state) {
            businessAccount.contactDetails.addressDetails.state =
              contactDetails.addressDetails.state;
          }
          if (contactDetails.addressDetails.city) {
            businessAccount.contactDetails.addressDetails.city =
              contactDetails.addressDetails.city;
          }
          if (contactDetails.addressDetails.address) {
            businessAccount.contactDetails.addressDetails.address =
              contactDetails.addressDetails.address;
          }
          if (contactDetails.addressDetails.place) {
            businessAccount.contactDetails.addressDetails.place =
              contactDetails.addressDetails.place;
          }
          if (contactDetails.addressDetails.pincode) {
            businessAccount.contactDetails.addressDetails.pincode =
              contactDetails.addressDetails.pincode;
          }
          if (contactDetails.addressDetails.landmark) {
            businessAccount.contactDetails.addressDetails.landmark =
              contactDetails.addressDetails.landmark;
          }
        }
      }

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: "BusinessAccount profile updated successfully",
        businessAccount: nbusinessAccount,
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
 * to change a businessAccount profile pic
 * @param {String} businessAccountId
 * @param {Object} image
 * @returns businessAccount
 */
export const changeBusinessAccountProfileImage = (
  businessAccountId: string,
  image: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId) || !image) {
        return reject({
          message: "Provide valid businessAccount id and image",
          statusCode: 400,
        });
      }

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount) {
        return reject({
          message: "Business Account not found",
          statusCode: 404,
        });
      }

      businessAccount.profilePicture = {
        key: image.key.split("/").slice(-1)[0],
        mimetype: image.mimetype,
      };

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: "Business Account profile picture changed successfully",
        businessAccount: nbusinessAccount,
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
 * to remove a businessAccount profile pic
 * @param {String} businessAccountId
 * @returns businessAccount
 */
export const removeBusinessAccountProfileImage = (
  businessAccountId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId)) {
        return reject({
          message: "Provide valid businessAccount id",
          statusCode: 400,
        });
      }

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount) {
        return reject({
          message: "Business Account not found",
          statusCode: 404,
        });
      }

      businessAccount.profilePicture = null;

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: "Business Account profile picture removed successfully",
        businessAccount: nbusinessAccount,
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
 * Add a new businessAccount image
 * @param {String} businessAccountId
 * @param {Object} image
 * @returns businessAccount
 */
export const addGalleryImage = (businessAccountId: string, image: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId) || !image) {
        return reject({
          message: "Provide valid businessAccount id and image",
          statusCode: 400,
        });
      }

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount) {
        return reject({
          message: "Business Account not found",
          statusCode: 404,
        });
      }

      businessAccount.gallerys.push({
        _id: new mongoose.Types.ObjectId().toString(),
        key: image.key.split("/").slice(-1)[0],
        mimetype: image.mimetype,
      });

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: "Business Account gallery added successfully",
        businessAccount: nbusinessAccount,
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
 * Remove a businessAccount image
 * @param {String} businessAccountId
 * @param {String} galleryId
 * @returns businessAccount
 */
export const removeGalleryImage = (
  businessAccountId: string,
  galleryId: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !businessAccountId ||
        !isValidObjectId(businessAccountId) ||
        !galleryId ||
        !isValidObjectId(galleryId)
      ) {
        return reject({
          message: "Provide valid businessAccount id and gallery id ",
          statusCode: 400,
        });
      }

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount) {
        return reject({
          message: "Business Account not found",
          statusCode: 404,
        });
      }
      businessAccount.gallerys = businessAccount.gallerys.filter(
        (gallery) => gallery._id.toString() != galleryId.toString()
      );

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: "Business Account gallery removed successfully",
        businessAccount: nbusinessAccount,
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
 * Remove all image from a businessAccount
 * @param {String} businessAccountId
 * @returns businessAccount
 */
export const removeAllGalleryImages = (businessAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId)) {
        return reject({
          message: "Provide valid businessAccount id",
          statusCode: 400,
        });
      }

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount) {
        return reject({
          message: "Business Account not found",
          statusCode: 404,
        });
      }

      businessAccount.gallerys = [];

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: "Business Account gallery images removed successfully",
        businessAccount: nbusinessAccount,
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
 * To check the businessAccount status
 * @param {String} businessAccountId
 * @returns {BusinessAccount} businessAccount
 */
export const checkBusinessAccountStatus = (
  businessAccountId: string,
  status: string[]
) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      if (
        !businessAccountId ||
        !isValidObjectId(businessAccountId) ||
        status.length <= 0
      )
        throw new ThrowError(
          "Provide vaild businessAccount id and status",
          400
        );

      const businessAccount = await BusinessAccount.findOne({
        _id: businessAccountId,
        isDeleted: false,
      });

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      if (businessAccount.status === "Inactive")
        businessAccount.status = "Active";
      businessAccount.lastUsed = new Date();
      await businessAccount.save();

      if (status.includes(businessAccount.status)) {
        return resolve({
          message: `BusinessAccount is ${businessAccount.status}`,
          businessAccount: {
            id: businessAccount._id,
            name: businessAccount.name,
            role: "BusinessAccount",
            status: businessAccount.status,
          },
        });
      }
      reject({ message: `BusinessAccount is ${businessAccount.status}` });
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
 * To check availablility for businessAccount's username
 * @param {String} username
 * @returns
 */
export const checkBusinessAccountUsernameAvailability = (username: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!username) throw new ThrowError("Provide username", 400);

      if (!username.includes(BUSINESS_ACCOUNT_USERNAME_STARTS_WITH)) {
        return resolve({
          message: "Username unavailable",
          availability: false,
        });
      }

      const businessAccount = await BusinessAccount.findOne({ username });

      if (!businessAccount) {
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
 * To change businessAccount password
 * @param {String} businessAccountId
 * @param {Passwords} data
 * @returns
 */
export const changeBusinessAccountPassword = (
  businessAccountId: string,
  data: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentPassword, password } = data;

      if (
        !businessAccountId ||
        !isValidObjectId(businessAccountId) ||
        !password ||
        !currentPassword
      )
        throw new ThrowError(
          "Provide vaild businessAccount id, currentPassword and password",
          400
        );

      const businessAccount = await BusinessAccount.findOne(
        { _id: businessAccountId },
        { password: 1 }
      );

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      const isMatch = await businessAccount.matchPassword(
        businessAccount.password!
      );
      if (isMatch) {
        businessAccount.password = password;

        await businessAccount.save();

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
 * To change a businessAccounts status
 * @param {String} businessAccountId
 * @param {String} status
 * @returns {BusinessAccount} businessAccount
 */
export const changeBusinessAccountStatus = (
  businessAccountId: string,
  status: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !businessAccountId ||
        !isValidObjectId(businessAccountId) ||
        !["Active", "Inactive", "Blocked"].includes(status)
      )
        throw new ThrowError(
          "Provide vaild businessAccount id and status",
          404
        );

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      businessAccount.status =
        status === "Active"
          ? "Active"
          : status === "Suspended"
          ? "Suspended"
          : status === "Blocked"
          ? "Blocked"
          : "Inactive";

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: `${nbusinessAccount.name} status changed to ${nbusinessAccount.status}`,
        businessAccount: nbusinessAccount,
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
 * To change a username for businessAccount
 * @param {String} businessAccountId
 * @param {String} username
 * @returns {BusinessAccount} businessAccount
 */
export const changeBusinessAccountUsername = (
  businessAccountId: string,
  username: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !businessAccountId ||
        !isValidObjectId(businessAccountId) ||
        !username
      )
        throw new ThrowError(
          "Provide vaild businessAccount id and username",
          400
        );

      if (username && !username.includes(BUSINESS_ACCOUNT_USERNAME_STARTS_WITH))
        throw new ThrowError("Invalid Username", 404);

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      if (businessAccount.username === username)
        throw new ThrowError("Old and new username must be different", 400);

      const businessAccountExists = await BusinessAccount.findOne({
        _id: { $ne: businessAccountId },
        username,
        role: "BusinessAccount",
      });
      if (businessAccountExists)
        throw new ThrowError(
          "Username already exist for other businessAccount",
          400
        );

      businessAccount.username = username;

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: `${nbusinessAccount.name}'s username changed to ${nbusinessAccount.username}`,
        businessAccount: nbusinessAccount,
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
 * To change a email for businessAccount
 * @param {String} businessAccountId
 * @param {String} email
 * @returns {BusinessAccount} businessAccount
 */
export const changeBusinessAccountEmail = (
  businessAccountId: string,
  email: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId) || !email)
        throw new ThrowError("Provide vaild businessAccount id and email", 400);

      const businessAccount = await BusinessAccount.findById(businessAccountId);

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      if (businessAccount.email === email)
        throw new ThrowError("Old and new email must be different", 400);

      const businessAccountExists = await BusinessAccount.findOne({
        _id: { $ne: businessAccountId },
        email,
        role: "BusinessAccount",
      });
      if (businessAccountExists)
        throw new ThrowError(
          "Email already exist for other businessAccount",
          400
        );

      businessAccount.email = email;

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: `${nbusinessAccount.name}'s email changed to ${nbusinessAccount.email}`,
        businessAccount: nbusinessAccount,
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
 * To change a phone for businessAccount
 * @param {String} businessAccountId
 * @param {String} phone
 * @returns {BusinessAccount} businessAccount
 */
export const changeBusinessAccountPhone = (
  businessAccountId: string,
  phone: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId) || !phone) {
        return reject({
          message: "Provide vaild businessAccount id and phone",
          statusCode: 404,
        });
      }

      const businessAccount = await BusinessAccount.findById(businessAccountId);
      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      if (businessAccount.phone === phone)
        throw new ThrowError("Old and new phone must be different", 400);

      const businessAccountExists = await BusinessAccount.findOne({
        _id: { $ne: businessAccountId },
        phone,
        role: "BusinessAccount",
      });
      if (businessAccountExists)
        throw new ThrowError(
          "Phone number already exist for other businessAccount",
          400
        );

      businessAccount.phone = phone;

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: `${nbusinessAccount.name}'s phone changed to ${nbusinessAccount.phone}`,
        businessAccount: nbusinessAccount,
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
export const forgotBusinessAccountPassword = (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) throw new ThrowError("Please Provide Email", 400);

      const businessAccount = await BusinessAccount.findOne({ email });
      let token: string = "";
      if (businessAccount) {
        businessAccount.resetPasswordAccess = true;
        await businessAccount.save();

        token = await generateToken({
          id: businessAccount._id.toString(),
          name: businessAccount.name,
          role: "BusinessAccount",
          type: "ResetToken",
        });

        const VERIFY_URL = CLIENT_DOMAIN + "/business/reset/" + token;

        sendMail({
          templateId: EMAILJS_RESET_TEMPLATE_ID,
          templateData: {
            name: businessAccount.name,
            email: businessAccount.email,
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
export const resetBusinessAccountPassword = (
  token: string,
  password: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token || !password)
        throw new ThrowError("Please Provide Token and Password", 400);
      const decoded = await verifyToken(token, "ResetToken");

      if (decoded && decoded.id) {
        const businessAccountFound = await BusinessAccount.findOne(
          {
            _id: decoded.id,
            resetPasswordAccess: true,
          },
          {
            password: 1,
            resetPasswordAccess: 1,
          }
        );
        if (businessAccountFound) {
          const isMatch = await businessAccountFound.matchPassword(password);
          if (isMatch) {
            throw new ThrowError("New Pasword and Old Password is Same", 400);
          } else {
            businessAccountFound.password = password;
            businessAccountFound.resetPasswordAccess = false;
            await businessAccountFound.save();
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
 * To delete a non deleted businessAccount temporarily
 * @param {String} businessAccountId
 */
export const deleteBusinessAccount = (businessAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId))
        throw new ThrowError("Provide valid businessAccount id", 400);

      const businessAccount = await BusinessAccount.findOne({
        _id: businessAccountId,
        isDeleted: false,
      });

      if (!businessAccount)
        throw new ThrowError("BusinessAccount not found", 404);

      businessAccount.status = "Inactive";
      businessAccount.isDeleted = true;
      businessAccount.deletedAt = new Date();

      await businessAccount.save();

      resolve({
        message: `${businessAccount.name} businessAccount was deleted`,
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
 * To restore a deleted businessAccount
 * @param {String} businessAccountId
 * @returns businessAccount
 */
export const restoreBusinessAccount = (businessAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId))
        throw new ThrowError("Provide valid businessAccount id", 400);

      const businessAccount = await BusinessAccount.findOne({
        _id: businessAccountId,
        isDeleted: true,
      });

      if (!businessAccount) {
        return reject({
          message: "BusinessAccount not found",
          statusCode: 404,
        });
      }

      businessAccount.status = "Active";
      businessAccount.isDeleted = false;
      businessAccount.deletedAt = undefined;

      const nbusinessAccount = await businessAccount.save();

      resolve({
        message: `${nbusinessAccount.name} businessAccount was restored`,
        businessAccount: nbusinessAccount,
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
 * To delete a businessAccount permanently
 * @param {String} businessAccountId
 */
export const pDeleteBusinessAccount = (businessAccountId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!businessAccountId || !isValidObjectId(businessAccountId))
        throw new ThrowError("Provide valid businessAccount id", 400);

      const businessAccount = await BusinessAccount.findOne({
        _id: businessAccountId,
        isDeleted: true,
      });

      if (!businessAccount) {
        return reject({
          message: "BusinessAccount not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await businessAccount.deleteOne();
        return resolve({
          message: `${businessAccount.name} businessAccount was deleted`,
        });
      }
      throw new ThrowError(
        `Not able to delete businessAccount in ${NODE_ENV} mode`,
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
 * To delete all businessAccount in development mode
 */
export const deleteAllBusinessAccount = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await BusinessAccount.deleteMany({});
        return resolve({ message: "All businessAccount deleted" });
      }
      throw new ThrowError(
        `Not able to delete all businessAccounts in ${NODE_ENV} mode`,
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
