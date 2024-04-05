"use client";
import React from "react";
import { useFormik } from "formik";
import { verifyOtpSchema } from "../../ValidationScema/Index";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CompanyUserApi from "@/CompanyUserApi";
import { XCircle } from "lucide-react";
import { mainUrl } from "@/app/Config";

const initialValues = {
  email: "",
  otp: "",
};

const Page = () => {
  const router = useRouter();

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: verifyOtpSchema,
    onSubmit: async (values) => {
      try {
        const response = await CompanyUserApi(
          `${mainUrl}/companyUser/verify-otp`,
          "POST",
          values
        );
        if (response.status === true) {
          resetForm();
          const resetKey = response.resetToken;
          router.push(`/admin/reset-password/${resetKey}`);
        } else {
          alert(response?.message);
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
    },
  });

  const ResendOTP = (email) => {
    fetch(`${mainUrl}/companyUser/forgotpasswordreset-otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === true) {
          alert("OTP Sent to your mail");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert(error.message);
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg flex flex-col gap-6"
        >
          <h2 className="text-[28px] font-semibold text-[#FF8A00] text-center">
            Reset Password Mail Sent
          </h2>
          <p className="text-sm font-normal text-center leading-[24px] text-[#667085]">
            An email has been sent to your registered email address for password
            reset. Kindly click on the link provided in the email to initiate
            the password reset process.
          </p>
          <p className="text-sm font-normal text-center text-[#667085]">
            Didn’t received?{" "}
            <a
              onClick={() => {
                ResendOTP(values.email);
              }}
              className="text-sm cursor-pointer font-normal text-center  leading-normal text-[#F59E0B] transition duration-150 ease-in-out hover:text-yellow-500 focus:text-yellow-500 focus:outline-none"
            >
              Resend email
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Page;
