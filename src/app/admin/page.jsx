"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";

const Page = () => {
  useEffect(() => {
    const chechToken = getCheckToken();

    if (chechToken) {
      redirect("/dashboard");
    } else {
      redirect("/admin/sign-in");
    }
  }, []);
};

const getCheckToken = () => {
  const token = Cookies.get("token");
  return token;
};

export default Page;
