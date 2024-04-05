"use client";
import React from "react";
import { useFormik } from "formik";
import { validationForgotSchema } from "../../ValidationScema/Index";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CompanyUserApi from "@/CompanyUserApi";
import { XCircle } from "lucide-react";
import { mainUrl } from "@/app/Config";

const initialValues = {
  email: "",
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
    validationSchema: validationForgotSchema,
    onSubmit: async (values) => {
      try {
        const response = await CompanyUserApi(
          `${mainUrl}/admin/forgot-password/request-link`,
          "POST",
          values
        );

        if (response.status === true) {
          resetForm();

          // const resetKey = response.resetToken;
          // router.push(`/admin/reset-password/${resetKey}`);
          router.push("/admin/verify-otp");
        } else {
          alert(response?.message);
        }
      } catch (error) {
        alert(error);
        console.log(`Error: ${error}`);
      }
    },
  });

  const resetfield = () => {
    resetForm({ values: { ...values, email: "" } });
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
          <p className="text-center text-3xl font-semibold text-[#101828] mb-6">
            Reset Password
          </p>

          <p className="text-center   text-[#101828] mb-6">
            Enter a valid email address we’ll send a OTP to reset your password.
          </p>
          <div className="relative" data-te-input-wrapper-init="">
            <label
              htmlFor="email"
              className="block mb-3 text-base font-medium text-[#101828] "
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className=" border border-[#E0E0E0] text-gray-900 text-base  block w-full p-2.5  dark:placeholder-gray-400 dark:text-white "
              placeholder="Enter Email Address"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                background: "#fff",
                border: errors.email && touched.email && "1px solid red ",
              }}
            />
            {errors.email && touched.email && (
              <XCircle
                onClick={resetfield}
                className="absolute text-red-500 top-[47px] right-3 transition-all duration-[0.3s] w-4"
              />
            )}
            {errors.email && touched.email ? (
              <div className="text-red-500 text-xs">{errors.email}</div>
            ) : null}
          </div>
          <div className="flex justify-between items-center "></div>

          <button
            className="bg-[#F59E0B] text-base font-medium w-full py-3 text-[#fff] rounded-lg transition duration-300 ease-in-out hover:bg-yellow-500"
            type="submit"
          >
            Send Link
          </button>
          <div className="text-center">
            <Link
              href="/admin/sign-in"
              type="submit"
              className="inline-block text-xs font-medium uppercase leading-normal text-[#F59E0B] transition duration-150 ease-in-out hover:text-yellow-500 focus:text-yellow-500 focus:outline-none"
              data-te-ripple-init=""
              data-te-ripple-color="light"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
