import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}
export const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    port: Number(process.env.SMTP_PORT),
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const { email, subject, template, data } = options;

  //get the path to the email template file
  const templatePath = path.join(__dirname, "../mails", template);

  //   Render the email template with ejs

  const html: string = await ejs.renderFile(templatePath, data);
  const mailOptions = {
    from: process.env.SMTP_MAIL!,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
