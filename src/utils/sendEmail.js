import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendConfirmEmail = async (recipient, url) => {
  return await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: 'Hospital Management - Xác nhận tài khoản',
    html: returnEmail(url, 'confirm'),
  });
};

const sendForgotPasswordEmail = async (recipient, url) => {
  return await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: 'Hospital Management - Đặt lại mật khẩu',
    html: returnEmail(url, 'password'),
  });
};

const returnEmail = (url, type) => {
  let preheaderContent =
    type === 'confirm'
      ? 'Xác thực địa chị email cho ứng dụng Hospital Management'
      : 'Đặt lại mật khẩu cho tài khoản ứng dụng Hospital Management';
  let titleContent =
    type === 'confirm'
      ? 'Xác thực địa chỉ Email của bạn'
      : 'Đặt lại mật khẩu của bạn';
  let bodyContent =
    type === 'confirm'
      ? 'Bạn đã dùng địa chỉ email này để đăng ký tài khoản sử dụng ứng dụng Hospital Management. Hãy nhấn nút Xác nhận bên dưới để hoàn thành việc đăng ký tài khoản cho ứng dụng Hospital Management.'
      : 'Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của ứng Hospital Management được đăng ký dưới địa chị email này. Hãy nhấn nút Đặt lại mật khẩu bên dưới để được cài đặt lại mật khẩu của bạn.';
  let buttonContent = type === 'confirm' ? 'Xác nhận' : 'Đặt lại mật khẩu';
  let warningContent =
    type === 'confirm'
      ? 'Nếu không phải là bạn đã đăng ký sử dụng dịch vụ thì hãy xóa email này một cách an toàn.'
      : 'Nếu không phải bạn đã yêu cầu đặt lại mật khẩu thì bạn hãy xóa email này một cách an toàn.';
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700&display=swap&subset=vietnamese" rel="stylesheet">
    <style type="text/css">
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%; /* 1 */
        -webkit-text-size-adjust: 100%; /* 2 */
      }

      /**
      * Remove extra space added to tables and cells in Outlook.
      */
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }

      /**
      * Better fluid images in Internet Explorer.
      */
      img {
        -ms-interpolation-mode: bicubic;
      }

      /**
      * Remove blue links for iOS devices.
      */
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }

      /**
      * Fix centering issues in Android 4.4.
      */
      div[style*='margin: 16px 0;'] {
        margin: 0 !important;
      }

      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        font-family:
          'Source Sans Pro', sans-serif;
      }

      /**
      * Collapse table borders to avoid space between cells.
      */
      table {
        border-collapse: collapse !important;
      }

      a {
        color: #0AC4BA;
      }

      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
    </style>
  </head>
  <body style="background-color: #e9ecef;">
    <!-- start preheader -->
    <div class="preheader" style="display: none !important; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0; visibility: hidden; mso-hide: all"
    >
      ${preheaderContent} &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj;
      &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj;
      &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj; &zwnj;
    </div>

    <!-- end preheader -->

    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style = "margin-top: 24px">
      <!-- start hero -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px;margin-top: 24px;"
          >
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"
              >
                <h1
                  style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;"
                >
                  <a
                    href="${process.env.FRONTEND_URL}"
                    target="_blank"
                    style="display: inline-block;"
                  >
                    <img
                      src="${process.env.BACKEND_URL}/icons/logo.png"
                      alt="Logo"
                      width="56"
                      style="display: block; width: 56px; max-width: 72px; min-width: 48px;"
                    />
                  </a>
                </h1>
                <h1
                  style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;"
                >
                  ${titleContent}
                </h1>
              </td>
            </tr>
          </table>

          <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </td>
      </tr>
      <!-- end hero -->

      <!-- start copy block -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px;"
          >
            <!-- start copy -->
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"
              >
                <p style="margin: 0;text-align: justify">
                  ${bodyContent}
                </p>
              </td>
            </tr>
            <!-- end copy -->

            <!-- start button -->
            <tr>
              <td align="left" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center"" bgcolor="#ffffff" style="padding: 12px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td
                            align="center"
                            bgcolor="#0AC4BA"
                            style="border-radius: 6px;"
                          >
                            <a
                              href="${url}"
                              target="_blank"
                              style="display: inline-block; font-weight: 700; padding: 16px 48px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;"
                              >
                              ${buttonContent}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- end button -->

            <!-- start copy -->
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"
              >
                <p style="margin: 0;">
                  ${warningContent}
                </p>
              </td>
            </tr>
            <!-- end copy -->

            <!-- start copy -->
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf"
              >
                <p style="margin: 0;">
                  Cheers,<br />
                  Industrial Automation Advisor Co., Ltd.
                </p>
              </td>
            </tr>
            <!-- end copy -->
          </table>

          <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </td>
      </tr>
      <!-- end copy block -->

      <!-- start footer -->
      <tr>
        <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
          <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 600px;"
          >
            <!-- start address -->
            <tr>
              <td
                align="center"
                bgcolor="#e9ecef"
                style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"
              >
                <p style="margin: 0;">
                  Industrial Automation Advisor Co., Ltd. 268 Lý Thường Kiệt, Phường 14, Quận 10, Hồ Chí Minh
                </p>
              </td>
            </tr>
            <!-- end address -->
          </table>

          <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
        </td>
      </tr>
      <!-- end footer -->
    </table>

    <!-- end body -->
  </body>
</html>
`;
};

export { sendConfirmEmail, sendForgotPasswordEmail };
