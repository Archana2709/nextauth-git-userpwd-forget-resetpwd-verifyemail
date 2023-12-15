import User from "@/models/User";
import connect from "@/utils/db"
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import crypto from "crypto";

export const POST=async(request:any)=>{
    const {email,password}=await request.json();

    await connect();
const existingUser=await User.findOne({email});
if(existingUser){
    return new NextResponse("Email is already in use",{status:400})
}
const hashedPassword=await bcrypt.hash(password,5)
const newUser=new User({email,password:hashedPassword})
const savedUser=await newUser.save();

  //const hashedToken = await bcrypt.hash(savedUser._id.toString(), 10)
  const emailToken = crypto.randomBytes(20).toString("hex");
  const newEmailToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");

console.log(savedUser)

const resetUrl = `localhost:3000/verifyemail/${newEmailToken}`;
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
    from: 'Admin <admin@modernwebdevelopment.net>',
    to: [email],
    subject: 'Verify your email address',
    //html: `Reset Password by clicking on the folling url  ${resetUrl}`,
    html:`<p> To verify your email ,Click on this link: <a href=${resetUrl}>Click here to verify your email</a>
            or copy and paste the link below in your browser. <br>  ${resetUrl}
            </p>`
}

const mailresponse = await transport.sendMail(mailOptions);
    try {
       // await newUser.save();
       await User.findByIdAndUpdate(savedUser._id, {verifyToken: newEmailToken, verifyTokenExpiry:Date.now() + 3600000})
        return new NextResponse("Email is send for verification",{status:200})
    } catch (err:any) {
        return new NextResponse(err,{status:500});
        
    }
}