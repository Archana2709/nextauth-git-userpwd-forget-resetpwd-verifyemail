import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from '@/utils/mailer'
import nodemailer from 'nodemailer';

export const POST = async (request: any) => {
  const { email } = await request.json();

  await connect();
  const existingUser = await User.findOne({ email });
  console.log(existingUser);
  if (!existingUser) {
    return new NextResponse("Email doesn't exists", { status: 400 });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetExpires = Date.now() + 3600000;
  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;
  const resetUrl = `localhost:3000/reset-password/${resetToken}`;
  console.log(resetUrl);

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1df90aa192559d",
      pass: "62a3cf7c000020"
    }
  });

  const mailOptions = {
    from: 'hitesh@gmail.com',
    to: email,
    subject:"Reset your password",
    //html: `Reset Password by clicking on the folling url  ${resetUrl}`,
    html:`<p>Click <a href=${resetUrl}>here</a> to reset your password}
            or copy and paste the link below in your browser. <br>  ${resetUrl}
            </p>`
}

const mailresponse = await transport.sendMail(mailOptions);
  
  //Sending mail using SENDGRID.com
//   const body = "Reset Password by clicking on the folling url" + resetUrl;
//   const msg = {
//     to: email,
//     from: "two@two.com",
//     subject: "Reset Password",
//     text: body,
//   };

//   //sgMail.setApiKey(process.env.SENDFRID_API_KEY ||"")

//   sgMail
//     .send(msg)
//     .then(() => {
//       return new NextResponse("Reset password email is sent.", { status: 200 });
//     })
//     .catch(async (error) => {
//       existingUser.resetToken = undefined;
//       existingUser.resetTokenExpiry = undefined;
//       existingUser.save();

//       return new NextResponse("Failed sending email ,try again", {
//         status: 400,
//       });
//     });

  try {
    await existingUser.save();
    return new NextResponse("Eamil is send for reseting password", {
      status: 200,
    });
  } catch (error:any) {
    return new NextResponse(error, { status: 500 });
  }
};
