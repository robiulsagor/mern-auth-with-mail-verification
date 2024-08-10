import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./email-template.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationMail = async (email, verificationToken) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      category: "Integration Test",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    console.log("Email sent successfully, ", response);
  } catch (error) {
    console.log(error);

    throw new Error("Failed to send email: ", error);
  }
};

export const sendWelcomeMail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "4ef9256e-69a1-48ba-9541-6c7157838231",
      template_variables: {
        company_info_name: "MERN AUTH Limited, Bangladesh",
        name: name,
        company_info_address: "Bagerhat, Morrelganj, Bangladesh",
        company_info_city: "Bagerhat",
        company_info_zip_code: "9320",
        company_info_country: "Bangladesh",
      },
    });

    console.log("Email sent successfully, ", response);
  } catch (error) {
    console.log(error);

    throw new Error("Failed to send email: ", error);
  }
};

export const sendForgotPasswordMail = async (email, resetURL) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Password Reset",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("Reset Password Email sent successfully, ", response);
  } catch (error) {
    console.log(error);
  }
};

export const sendPasswordResetSuccessMail = async (email) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Reset Password Email sent successfully, ", response);
  } catch (error) {
    console.log(error);
  }
};
