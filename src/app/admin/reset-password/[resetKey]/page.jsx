"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { validationResetSchema } from "../../../ValidationScema/Index";
import { useRouter } from "next/navigation";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import CompanyUserApi from "@/CompanyUserApi";
import { mainUrl } from "@/app/Config";

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const Page = ({ params }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConformPassword, setShowConformPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConformPasswordVisibility = () => {
    setShowConformPassword((prevShowPassword) => !prevShowPassword);
  };

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
    validationSchema: validationResetSchema,
    onSubmit: async (values) => {
      try {
        const response = await CompanyUserApi(
          `${mainUrl}/admin/reset-password/${params.resetKey}`,
          "POST",
          values
        );
        if (response.status === true) {
          resetForm();
          router.push("/admin/sign-in");
        } else {
          alert(response?.message);
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    },
  });

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
          <p className="text-center text-[30px]  font-semibold text-[#101828]">
            Reset Password{" "}
          </p>

          <p className="text-center   text-[#101828] mb-6">
            Enter a valid email address we’ll send a OTP to reset your password.
          </p>

          <div className="relative" data-te-input-wrapper-init="">
            <label
              htmlFor="newPassword"
              className="block mb-3 text-base font-medium text-[#101828]"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className=" border border-[#E0E0E0] text-gray-900 text-base  block w-full p-2.5  dark:placeholder-gray-400 dark:text-white "
                placeholder="Enter Password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  background: "#fff ",
                  border:
                    errors.newPassword &&
                    touched.newPassword &&
                    "1px solid red ",
                }}
              />
              <button
                type="button"
                className="absolute top-[11px] right-5 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoMdEyeOff /> : <IoEye />}
              </button>
            </div>
            {errors.newPassword && touched.newPassword ? (
              <div className="text-red-500 text-xs">{errors.newPassword}</div>
            ) : null}
          </div>

          <div className="relative  " data-te-input-wrapper-init="">
            <label
              htmlFor="confirmPassword"
              className="block mb-3 text-base font-medium text-[#101828]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                className=" border border-[#E0E0E0] text-gray-900 text-base  block w-full p-2.5  dark:placeholder-gray-400 dark:text-white "
                placeholder="Enter Password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  background: "#fff ",
                  border:
                    errors.confirmPassword &&
                    touched.confirmPassword &&
                    "1px solid red ",
                }}
              />

              <button
                type="button"
                className="absolute top-[11px] right-5 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleConformPasswordVisibility}
              >
                {showPassword ? <IoMdEyeOff /> : <IoEye />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword ? (
              <div className="text-red-500 text-xs">
                {errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <button
            className="bg-[#F59E0B] text-base font-medium w-full py-3 text-[#fff] rounded-lg transition duration-300 ease-in-out hover:bg-yellow-500"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default Page;
