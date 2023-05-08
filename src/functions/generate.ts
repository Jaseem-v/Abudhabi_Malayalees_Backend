import { IRoles } from './../types/default';
import { config } from "../config/index";
const { CLIENT_DOMAIN, CLIENT_ADMIN_DOMAIN } = config.CLIENT;
const { APP_NAME, APP_LOGO_URL } = config.APP;

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generatePassword = (length = 14) => {
  const set1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const set2 = "abcdefghijklmnopqrstuvwxyz";
  const set3 = "@#$_";
  const set4 = "1234567890";
  let result: string = "";

  for (let i = 1; i <= length; i++) {
    if (i % 2 && i < 8) {
      let no = Math.ceil(Math.random() * set1.length);
      result += set1.charAt(no);
    } else if (i >= 8 && i < 9) {
      let no = Math.ceil(Math.random() * set3.length);
      result += set3.charAt(no);
    } else if (i >= 10 && i < 12) {
      let no = Math.ceil(Math.random() * set4.length);
      result += set4.charAt(no);
    } else {
      let no = Math.ceil(Math.random() * set2.length);
      result += set2.charAt(no);
    }
  }
  return result;
};

/**
 *
 * @param {String} type - html | text
 * @param {Object}} { name, email, role }
 * @returns
 */
export const generateCredentialsMailTemplate = (
  type: "text" | "html",
  { name, email, role, password }:{name: string; email: string; role: IRoles; password: string}
) => {
  if (type && type === "text") {
    return `
    Welcome ${name}!, ${APP_NAME} welcomes you as a new ${role}\n
    Use the below credentials to login to your account\n
    \tEmail: \t${email}
    \tPassword: \t${password}
    \tLogin: \t${CLIENT_ADMIN_DOMAIN}
        `;
  } else {
    return `
    <!doctype html>
    <html lang="en-US">
    
    <head>
        <meta charset="utf-8">
        <title>Login Credentials</title>
        <meta name="description" content="Login Credentials">
        <style type="text/css">
            a:hover {
                text-decoration: underline !important;
            }
        </style>
    </head>
    
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <a href="${CLIENT_DOMAIN}" title="logo" target="_blank">
                                    <img width="300"
                                        src="${APP_LOGO_URL}"
                                        title="logo" alt="logo">
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1
                                                style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                Welcome ${name}!</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                Trentit welcomes you as a new <h3 style="text-transform: uppercase;" >${role}</h3> We are glad to have you on board.
                                            </p>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                Use the below credentials to login to your account.
                                            </p>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                <h4>Email: ${email}</h4>
                                            </p>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                <h4>Password: ${password}</h4>
                                            </p>
                                
                                            <a href=${CLIENT_ADMIN_DOMAIN}
                                                style="background:#242E3A;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                Let's Start
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p
                                    style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">
                                    &copy; <strong>${
                                      CLIENT_DOMAIN.split("//")[1]
                                    }</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    
    </html>
          `;
  }
};

/**
 * Get a Reset Password Template
 * @param {String} type - text || html
 * @param {Object} { name, email, token }
 * @returns
 */
export const generateResetPasswdMailTemplate = (
  type: "text" | "html",
  { name, email, token }: { name: string; email: string; token: string }
) => {
  if (type && type === "text") {
    return `
    Hii ${name}!, You have requested to reset your password\n
    We cannot simply send your old password. A unique link to reset your password has been generated for you. To reset your password, click the Ifollowing link and follow the instructions\n
    \tEmail: ${email}
    \tReset Password: ${CLIENT_DOMAIN}/auth/reset/${token}
        `;
  } else {
    return `
    <!doctype html>
<html lang="en-US">

<head>
    <meta charset="utf-8">
    <title>Reset Password</title>
    <meta name="description" content="Reset Password">
    <style type="text/css">
        a:hover {
            text-decoration: underline !important;
        }
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <a href="${CLIENT_DOMAIN}" title="logo" target="_blank">
                                <img width="300"
                                    src="${APP_LOGO_URL}"
                                    title="logo" alt="logo">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1
                                            style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                            Hii ${name}!, You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${CLIENT_DOMAIN}/auth/reset/${token}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p
                                style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">
                                &copy; <strong>${
                                  CLIENT_DOMAIN.split("//")[1]
                                }</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html> `;
  }
};

export const generateTagsFromSpecifications = (
  specifications: { key: string; value: string }[]
) => {
  let tags: string[] = [];
  specifications.map((specification) => {
    tags.push(specification.key.toString());
    tags.push(specification.value.toString());
  });
  return tags;
};
