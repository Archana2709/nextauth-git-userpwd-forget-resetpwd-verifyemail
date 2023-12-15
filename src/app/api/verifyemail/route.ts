import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import crypto from 'crypto';

export const POST = async (request: any) => {


    const { token } = await request.json();
    await connect();

  //const hashedToken=crypto.createHash("sha256").update(token).digest("hex");
  console.log(token);
    const user = await User.findOne({ verifyToken:token,verifyTokenExpiry:{$gt: Date.now()}});

    if (!user) {
      return new NextResponse("Invalid token or has expired", { status: 400 });
    }
    console.log(user);
   
    user.isVerfied = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    try {
    await user.save();
    //const newUser1= await User.findByIdAndUpdate({verifyToken: token},{isVerfied:true,verifyToken: undefined,verifyTokenExpiry: undefined})
    // return new NextResponse("Email is send for verification",{status:200})
    // await user.save();
    return new NextResponse(JSON.stringify(user),{status:200})
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
