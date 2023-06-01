import { ErrorResponse } from "../classes";
import { verifyToken } from "../utils";
import { personalAccountHelpers, businessAccountHelpers,  userHelpers, adminHelpers } from "../helpers";
import { config } from "../config";
import { ApiParams } from "../types";

const { SERVER_ACCESS_TOKEN_KEY } = config.SERVER;

export const superAdminAccess: ApiParams = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes("Bearer")
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }
    const authorizationToken = req.headers.authorization.split(" ")[1];

    // const cookieToken = req.cookies[SERVER_ACCESS_TOKEN_KEY];
    // console.log(authorizationToken, req.cookies, cookieToken);
    if (
      !authorizationToken
      //  ||
      // !cookieToken ||
      // authorizationToken != cookieToken
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }

    const decoded = (await verifyToken(authorizationToken, "AccessToken"))
      .payload;
    if (decoded && ["SuperAdmin", "Developer"].includes(decoded.role ?? "")) {
      const admin = await (
        await adminHelpers.checkAdminStatus(decoded.id, ["Active"])
      ).admin;
      req.client = {
        id: admin.id,
        name: admin.name,
        status: admin.status,
        role: admin.role,
      };
      return next();
    } else {
      return next(new ErrorResponse("Unathenticated", 403));
    }
  } catch (error: any) {
    return next(new ErrorResponse("Unathenticated", error.statusCode || 403));
  }
};

export const adminAccess: ApiParams = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes("Bearer")
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }
    const authorizationToken = req.headers.authorization.split(" ")[1];
    // const cookieToken = req.cookies[SERVER_ACCESS_TOKEN_KEY];
    // console.log(authorizationToken, req.cookies, cookieToken);
    if (
      !authorizationToken
      //  ||
      // !cookieToken ||
      // authorizationToken != cookieToken
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }

    const decoded = (await verifyToken(authorizationToken, "AccessToken"))
      .payload;
    if (
      decoded &&
      ["SuperAdmin", "Developer", "Admin"].includes(decoded.role ?? "")
    ) {
      const admin = await (
        await adminHelpers.checkAdminStatus(decoded.id, ["Active"])
      ).admin;
      req.client = {
        id: admin.id,
        name: admin.name,
        status: admin.status,
        role: admin.role,
      };
      return next();
    } else {
      return next(new ErrorResponse("Unathenticated", 403));
    }
  } catch (error: any) {
    return next(new ErrorResponse("Unathenticated", error.statusCode || 403));
  }
};

export const userAccess: ApiParams = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes("Bearer")
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }
    const authorizationToken = req.headers.authorization.split(" ")[1];
    console.log(authorizationToken);
    // const cookieToken = req.cookies[SERVER_ACCESS_TOKEN_KEY];
    // console.log(authorizationToken, req.cookies, cookieToken);
    if (
      !authorizationToken
      //  ||
      // !cookieToken ||
      // authorizationToken != cookieToken
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }

    const decoded = (await verifyToken(authorizationToken, "AccessToken"))
      .payload;
    if (
      decoded &&
      ["PersonalAccount", "BusinessAccount"].includes(decoded.role ?? "")
    ) {
      // const user = await (
      //   await userHelpers.checkAdminStatus(decoded.id, ["Active"])
      // ).user;
      // req.client = {
      //   id: user.id,
      //   name: user.name,
      //   status: user.status,
      //   role: user.role,
      // };
      return next();
    } else {
      return next(new ErrorResponse("Unathenticated", 403));
    }
  } catch (error: any) {
    return next(new ErrorResponse("Unathenticated", error.statusCode || 403));
  }
};

export const personalAccountAccess: ApiParams = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes("Bearer")
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }
    const authorizationToken = req.headers.authorization.split(" ")[1];
    console.log(authorizationToken);
    // const cookieToken = req.cookies[SERVER_ACCESS_TOKEN_KEY];
    // console.log(authorizationToken, req.cookies, cookieToken);
    if (
      !authorizationToken
      //  ||
      // !cookieToken ||
      // authorizationToken != cookieToken
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }

    const decoded = (await verifyToken(authorizationToken, "AccessToken"))
      .payload;
    if (decoded && decoded.role === "PersonalAccount") {
      const personalAccount = await (
        await personalAccountHelpers.checkPersonalAccountStatus(decoded.id, ["Active"])
      ).personalAccount;
      req.client = {
        id: personalAccount.id,
        name: personalAccount.name,
        status: personalAccount.status,
        role: personalAccount.role,
      };
      return next();
    } else {
      return next(new ErrorResponse("Unathenticated", 403));
    }
  } catch (error: any) {
    console.log(error);
    return next(new ErrorResponse("Unathenticated", error.statusCode || 403));
  }
};

export const businessAccountAccess: ApiParams = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes("Bearer")
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }
    const authorizationToken = req.headers.authorization.split(" ")[1];
    console.log(authorizationToken);
    // const cookieToken = req.cookies[SERVER_ACCESS_TOKEN_KEY];
    // console.log(authorizationToken, req.cookies, cookieToken);
    if (
      !authorizationToken
      //  ||
      // !cookieToken ||
      // authorizationToken != cookieToken
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }

    const decoded = (await verifyToken(authorizationToken, "AccessToken"))
      .payload;
      if (decoded && decoded.role === "BusinessAccount") {
        const businessAccount = await (
          await businessAccountHelpers.checkBusinessAccountStatus(decoded.id, ["Active"])
        ).businessAccount;
        req.client = {
          id: businessAccount.id,
          name: businessAccount.name,
          status: businessAccount.status,
          role: businessAccount.role,
        };
      return next();
    } else {
      return next(new ErrorResponse("Unathenticated", 403));
    }
  } catch (error: any) {
    return next(new ErrorResponse("Unathenticated", error.statusCode || 403));
  }
};

export const allRoleAccess: ApiParams = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes("Bearer")
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }
    const authorizationToken = req.headers.authorization.split(" ")[1];
    // const cookieToken = req.cookies[SERVER_ACCESS_TOKEN_KEY];
    // console.log(authorizationToken, req.cookies, cookieToken);
    if (
      !authorizationToken
      //  ||
      // !cookieToken ||
      // authorizationToken != cookieToken
    ) {
      throw new ErrorResponse("Unathenticated", 403);
    }

    const decoded = (await verifyToken(authorizationToken, "AccessToken"))
      .payload;
    if (decoded && ["SuperAdmin", "Developer"].includes(decoded.role ?? "")) {
      // const admin = await (
      //   await adminHelpers.checkAdminStatus(decoded.id, ["Active"])
      // ).admin;
      // req.client = {
      //   id: admin.id,
      //   name: admin.name,
      //   status: admin.status,
      //   role: admin.role,
      // };
      return next();
    } else if (
      decoded &&
      ["PersonalUser", "BusinessUser"].includes(decoded.role ?? "")
    ) {
      // const user = await (
      //   await userHelpers.checkAdminStatus(decoded.id, ["Active"])
      // ).user;
      // req.client = {
      //   id: user.id,
      //   name: user.name,
      //   status: user.status,
      //   role: user.role,
      // };
      return next();
    } else {
      return next(new ErrorResponse("Unathenticated", 403));
    }
  } catch (error: any) {
    return next(new ErrorResponse("Unathenticated", error.statusCode || 403));
  }
};
