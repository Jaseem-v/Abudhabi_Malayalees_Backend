import { Document } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { IRoles } from "../types";

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRE,
  JWT_RESET_TOKEN_SECRET,
  JWT_RESET_TOKEN_EXPIRE,
  JWT_VERIFICATION_TOKEN_SECRET,
  JWT_VERIFICATION_TOKEN_EXPIRE,
  JWT_TOKEN_ISSUER,
} = config.JWT;

interface IJwtPayload extends JwtPayload {
  id?: Document["id"];
  role?: IRoles;
}

type IJWT_Type = "AccessToken" | "VerifyToken" | "ResetToken";

export const generateToken = (meta: {
  id: string | Document["id"];
  name: string;
  role: IRoles;
  type: IJWT_Type;
  subject?: string;
}) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const { id, name, role, type, subject } = meta;
      const token = await jwt.sign(
        { id, role },
        type === "AccessToken"
          ? JWT_ACCESS_TOKEN_SECRET
          : type === "VerifyToken"
          ? JWT_VERIFICATION_TOKEN_SECRET
          : JWT_RESET_TOKEN_SECRET,
        {
          audience: name,
          issuer: JWT_TOKEN_ISSUER,
          expiresIn:
            type === "AccessToken"
              ? JWT_ACCESS_TOKEN_EXPIRE
              : type === "VerifyToken"
              ? JWT_VERIFICATION_TOKEN_EXPIRE
              : JWT_RESET_TOKEN_EXPIRE,
          subject: subject ?? "Generate Token",
        }
      );
      resolve(token);
    } catch (error: any) {
      reject({
        message: error.message,
        code: error.name,
      });
    }
  });
};

export const verifyToken = (token: string, type: IJWT_Type) => {
  return new Promise<IJwtPayload>(async (resolve, reject) => {
    try {
      const decoded: IJwtPayload = await jwt.verify(
        token,
        type === "AccessToken"
          ? JWT_ACCESS_TOKEN_SECRET
          : type === "VerifyToken"
          ? JWT_VERIFICATION_TOKEN_SECRET
          : JWT_RESET_TOKEN_SECRET,
        { complete: true }
      );
      resolve(decoded);
    } catch (error: any) {
      reject({
        message: error.message,
        code: error.name,
      });
    }
  });
};
