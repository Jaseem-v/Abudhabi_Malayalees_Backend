import dotenv from "dotenv";
import path from "path";

const ENV = process.env.NODE_ENV;
const SERVER_ROOT_PATH = path.join(__dirname, "../../");

const ENV_CONFIG =
  typeof ENV === "string" ? { path: SERVER_ROOT_PATH + ".env." + ENV } : {};

dotenv.config(ENV_CONFIG);

// App
const APP_NAME = process.env.APP_NAME || "APP_NAME";
const APP_LOGO_URL = process.env.APP_LOGO_URL || "E-APP_LOGO_URL";

const APP = {
  APP_NAME,
  APP_LOGO_URL,
};

// Server Config
const DOTENV_STATE = process.env.DOTENV_STATE || false;
const NODE_ENV = ENV || process.env.NODE_ENV || "development";
const SERVER_HOST = process.env.SERVER_HOST || "0.0.0.0";
const SERVER_DOMAIN = process.env.SERVER_DOMAIN || "0.0.0.0";
const SERVER_PORT =
  Number(process.env.SERVER_PORT) || Number(process.env.PORT) || 5000;
const SERVER_UPLOADS_PATH = SERVER_ROOT_PATH + "uploads/";
const SERVER_VIEWS_PATH = SERVER_ROOT_PATH + "public/views/";
const SERVER_IMAGES_PATH = SERVER_ROOT_PATH + "public/images/";
const DOCUMENTATION_URL = process.env.DOCUMENTATION_URL;
const SERVER_ACCESS_TOKEN_KEY =
  process.env.SERVER_ACCESS_TOKEN_KEY || "cb8e53a6a3d7e8b1ae74a7e28a553f79";
const SERVER_ACCESS_TOKEN_EXPIRE =
  process.env.SERVER_ACCESS_TOKEN_EXPIRE || "31557600000"; // 1 year
const SERVER = {
  NODE_ENV,
  SERVER_HOST,
  SERVER_DOMAIN,
  SERVER_PORT,
  DOTENV_STATE,
  DOCUMENTATION_URL,
  SERVER_ROOT_PATH,
  SERVER_UPLOADS_PATH,
  SERVER_VIEWS_PATH,
  SERVER_IMAGES_PATH,
  SERVER_ACCESS_TOKEN_KEY,
  SERVER_ACCESS_TOKEN_EXPIRE,
};

// Client Config
const CLIENT_HOST = process.env.CLIENT_HOST || "0.0.0.0";
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || "localhost";
const CLIENT_ADMIN_HOST = process.env.CLIENT_ADMIN_HOST || "0.0.0.0";
const CLIENT_ADMIN_DOMAIN = process.env.CLIENT_ADMIN_DOMAIN || "localhost";
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const CLIENT_DEV_HOSTS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];

const CLIENT = {
  CLIENT_HOST,
  CLIENT_DOMAIN,
  CLIENT_ADMIN_HOST,
  CLIENT_ADMIN_DOMAIN,
  CLIENT_PORT,
};

// Moongose config
const MONGO_USER = process.env.MONGO_USER || "MONGO_USER";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "MONGO_PASSWORD";
const MONGO_HOST = process.env.MONGO_HOST || "MONGO_HOST";
const MONGO_PORT = process.env.MONGO_PORT || "MONGO_PORT";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "MONGO_DATABASENAME";
const MONGO_SRV = process.env.MONGO_SRV || "NO";

const MONGO = {
  MONGO_USER,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_DATABASE,
  MONGO_PORT,
  MONGO_SRV,
};

/* Mongo Collections */
const MONGO_COLLECTIONS = {
  ADMINS: "Admins",
  USERS: "Users",
  CATEGORIES: "Categories",
};

//  JWT
const JWT_ACCESS_TOKEN_SESSION_NAME =
  process.env.JWT_ACCESS_TOKEN_SESSION_NAME || "access-session";
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "secret";
const JWT_ACCESS_TOKEN_EXPIRE = process.env.JWT_ACCESS_TOKEN_EXPIRE || "1y";
const JWT_RESET_TOKEN_SESSION_NAME =
  process.env.JWT_RESET_TOKEN_SESSION_NAME || "reset-session";
const JWT_RESET_TOKEN_SECRET = process.env.JWT_RESET_TOKEN_SECRET || "secret";
const JWT_RESET_TOKEN_EXPIRE = process.env.JWT_RESET_TOKEN_EXPIRE || "5m";
const JWT_TOKEN_ISSUER = process.env.JWT_TOKEN_ISSUER || "trentit.in";

// JWT
const JWT = {
  JWT_ACCESS_TOKEN_SESSION_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRE,
  JWT_RESET_TOKEN_SESSION_NAME,
  JWT_RESET_TOKEN_SECRET,
  JWT_RESET_TOKEN_EXPIRE,
  JWT_TOKEN_ISSUER,
};

// Scheduler
const BACKUP_STATUS = process.env.BACKUP_STATUS || "OFF";
const BACKUP_CRON_EXPRESSION =
  process.env.BACKUP_CRON_EXPRESSION || "0 0 * * *"; // Run at daily 12:00AM

const SCHEDULER = {
  BACKUP_STATUS,
  BACKUP_CRON_EXPRESSION,
};

// Sendgrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "SENDGRID_API_KEY";

const SENDGRID = {
  SENDGRID_API_KEY,
};

// Mail
const MAIL_SERVICE_HOST = process.env.MAIL_SERVICE_HOST || "MAIL_SERVICE_HOST";
const MAIL_SERVICE_NAME = process.env.MAIL_SERVICE_NAME || "MAIL_SERVICE_NAME";
const MAIL_SERVICE_PORT = process.env.MAIL_SERVICE_PORT || "MAIL_SERVICE_PORT";
const MAIL_AUTH_NAME = process.env.MAIL_AUTH_NAME || "MAIL_AUTH_NAME";
const MAIL_AUTH_USER = process.env.MAIL_AUTH_USER || "MAIL_AUTH_USER";
const MAIL_AUTH_PASS = process.env.MAIL_AUTH_PASS || "MAIL_AUTH_PASS";

const MAIL_SERVICE = {
  MAIL_SERVICE_HOST,
  MAIL_SERVICE_PORT,
  MAIL_SERVICE_NAME,
  MAIL_AUTH_NAME,
  MAIL_AUTH_USER,
  MAIL_AUTH_PASS,
};

const config = {
  MONGO,
  SERVER,
  CLIENT,
  APP,
  JWT,
  MONGO_COLLECTIONS,
  SCHEDULER,
};

export default config;
