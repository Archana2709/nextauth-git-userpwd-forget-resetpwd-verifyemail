"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
//import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Query } from "mongoose";
import axios from 'axios'

const VerifyEmail = ({ params }: any) => {
  console.log(params.token);
  const [error, setError] = useState("");
 //const [token, setToken]=useState("")
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);
  
  const { data: session, status: sessionStatus } = useSession();

   //token verification//
  const verifyToken = async () => {
    try {
      const res = await fetch("/api/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token }),
      });
      if (res.status === 400) {
        setError("Invalid token or has expired");
        //setVerified(true);
      }
      if (res.status === 200) {
        setError("");
        setVerified(true)
        const userData=await res.json();
   setUser(userData);
      }
    } catch (error) {
      setError("Error, try again");
     // setVerified(true)
      console.log(error);
    }
  };

    useEffect(() => {
      if(params.token.length > 0) {
        verifyToken();
      }
  }, [params.token]);
 
  
//   useEffect(() => {
//     if (sessionStatus === "authenticated") {
//       router.replace("/dashboard");
//     }
//   }, [sessionStatus, router]);

   return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

    <h1 className="text-4xl">Verify Email</h1>
    {/* <h2 className="p-2 bg-orange-500 text-black">{params.token ? `${params.token}` : "no token"}</h2> */}

    {verified && (
        <div>
            <h2 className="text-2xl"> your email- {user?.email} is verified </h2>
            {/* <Link href="/login">
                Login
            </Link> */}
        </div>
    )}
    {error && (
        <div>
            <h2 className="text-2xl bg-red-500 text-black">{error}</h2>
            
        </div>
    )}
</div>
   )
};

export default VerifyEmail;
