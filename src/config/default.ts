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
  BUSINESS_ACCOUNTS: "Business_Accounts",
  PERSONAL_ACCOUNTS: "Personal_Accounts",
  CATEGORIES: "Categories",
  ADVERTISEMENTS: "Advertisements",
  JOBS: "Jobs",
  GALLERYS: "Gallerys",
  NEWS: "News",
  EVENTS: "Events",
};

//  JWT
const JWT_ACCESS_TOKEN_SESSION_NAME =
  process.env.JWT_ACCESS_TOKEN_SESSION_NAME || "access-session";
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "secret";
const JWT_ACCESS_TOKEN_EXPIRE = process.env.JWT_ACCESS_TOKEN_EXPIRE || "1y";
const JWT_RESET_TOKEN_SECRET = process.env.JWT_RESET_TOKEN_SECRET || "secret";
const JWT_RESET_TOKEN_EXPIRE = process.env.JWT_RESET_TOKEN_EXPIRE || "5m";
const JWT_VERIFICATION_TOKEN_SECRET =
  process.env.JWT_VERIFICATION_TOKEN_SECRET || "secret";
const JWT_VERIFICATION_TOKEN_EXPIRE =
  process.env.JWT_VERIFICATION_TOKEN_EXPIRE || "5m";
const JWT_TOKEN_ISSUER = process.env.JWT_TOKEN_ISSUER || "trentit.in";

// JWT
const JWT = {
  JWT_ACCESS_TOKEN_SESSION_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRE,
  JWT_RESET_TOKEN_SECRET,
  JWT_RESET_TOKEN_EXPIRE,
  JWT_VERIFICATION_TOKEN_SECRET,
  JWT_VERIFICATION_TOKEN_EXPIRE,
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

//* AWS Config */
const AWS_S3_BUCKET_NAME =
  process.env.AWS_S3_BUCKET_NAME || "AWS_S3_BUCKET_NAME";
const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY || "AWS_S3_ACCESS_KEY";
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY || "AWS_S3_SECRET_KEY";
const AWS_S3_BUCKET_REGION =
  process.env.AWS_S3_BUCKET_REGION || "AWS_S3_BUCKET_REGION";
const AWS_S3_CATEGORY_RESOURCES =
  process.env.AWS_S3_CATEGORY_RESOURCES || "/categorys";
const AWS_S3_GALLERY_RESOURCES =
  process.env.AWS_S3_GALLERY_RESOURCES || "/gallerys";
const AWS_S3_BUSINESS_ACCOUNT_GALLERY_RESOURCES =
  process.env.AWS_S3_BUSINESS_ACCOUNT_GALLERY_RESOURCES ||
  "/business-account/gallerys";
const AWS_S3_BUSINESS_ACCOUNT_PROFILE_RESOURCES =
  process.env.AWS_S3_BUSINESS_ACCOUNT_PROFILE_RESOURCES ||
  "/business-account/profile-pictures";
const AWS_S3_PERSONAL_ACCOUNT_GALLERY_RESOURCES =
  process.env.AWS_S3_PERSONAL_ACCOUNT_GALLERY_RESOURCES ||
  "/personal-account/gallerys";
const AWS_S3_PERSONAL_ACCOUNT_PROFILE_RESOURCES =
  process.env.AWS_S3_PERSONAL_ACCOUNT_PROFILE_RESOURCES ||
  "/personal-account/profile-pictures";
const AWS_S3_ADZ_RESOURCES =
  process.env.AWS_S3_ADZ_RESOURCES || "/advertisements";
const AWS_S3_NEWS_RESOURCES = process.env.AWS_S3_NEWS_RESOURCES || "/news";

const AWS_S3 = {
  AWS_S3_BUCKET_NAME,
  AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_KEY,
  AWS_S3_BUCKET_REGION,
  AWS_S3_CATEGORY_RESOURCES,
  AWS_S3_GALLERY_RESOURCES,
  AWS_S3_BUSINESS_ACCOUNT_GALLERY_RESOURCES,
  AWS_S3_BUSINESS_ACCOUNT_PROFILE_RESOURCES,
  AWS_S3_PERSONAL_ACCOUNT_GALLERY_RESOURCES,
  AWS_S3_PERSONAL_ACCOUNT_PROFILE_RESOURCES,
  AWS_S3_ADZ_RESOURCES,
  AWS_S3_NEWS_RESOURCES,
};

const config = {
  MONGO,
  SERVER,
  CLIENT,
  APP,
  JWT,
  MONGO_COLLECTIONS,
  SCHEDULER,
  AWS_S3,
};

export default config;
