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
    subject: 'Hospital Management Confirm Email',
    html: `
        <html>
          <body>
            <a href="${url}">Confirm Email</a>
          </body>
        </html>
      `,
  });
};

const sendForgotPasswordEmail = async (recipient, url) => {
  return await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: 'Hospital Management Reset Password',
    html: `
        <html>
          <body>
            <a href="${url}">Reset Password</a>
          </body>
        </html>
      `,
  });
};

export { sendConfirmEmail, sendForgotPasswordEmail };
