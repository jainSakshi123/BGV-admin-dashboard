"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { validationLoginSchema } from "@/app/ValidationScema/Index";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { mainUrl } from "@/app/Config";
import Cookies from "js-cookie";
// import socket from "@/socket/socket";

const initialValues = {
  email: "",
  password: "",
};

const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
    validationSchema: validationLoginSchema,

    onSubmit: (values) => {
      fetch(`${mainUrl}/admin/login`, {
        method: "POST",
        body: JSON.stringify(values),
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
            Cookies.set("token", data.admin.token);
            Cookies.set("refreshToken", data.admin.refreshToken);
            // Cookies.set("companyName", data.admin.companyName);
            // Cookies.set("companyLogo", data.admin.companyLogo);

            resetForm();
            router.push("/dashboard");
          } else {
            alert(data?.message);
          }
        });
    },
  });
  const resetfield = () => {
    resetForm({ values: { ...values, email: "" } });
  };
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2  items-center text-neutral-800 dark:text-neutral-200  h-[100vh]">
        <div className=" w-full">
          <img alt="error" src="/assets/sign-in.png" className="" />
        </div>

        <div className="flex items-center flex-col rounded-b-lg  lg:rounded-r-lg lg:rounded-bl-none h-full">
          <form
            onSubmit={handleSubmit}
            className="w-full h-full flex flex-col justify-center items-center gap-6"
          >
            <p className="text-center text-[30px]  font-semibold text-[#101828]">
              Sign in{" "}
            </p>

            <div className="relative  w-[85%]" data-te-input-wrapper-init="">
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

            <div className="relative  w-[85%]" data-te-input-wrapper-init="">
              <label
                htmlFor="password"
                className="block mb-3 text-base font-medium text-[#101828]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className=" border border-[#E0E0E0] text-gray-900 text-base  block w-full p-2.5  dark:placeholder-gray-400 dark:text-white "
                  placeholder="Enter Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    background: "#fff ",
                    border:
                      errors.password && touched.password && "1px solid red ",
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
              {errors.password && touched.password ? (
                <div className="text-red-500 text-xs">{errors.password}</div>
              ) : null}
            </div>

            <div className="flex justify-between items-center w-[85%]">
              <div className="flex justify-start items-center gap-[10px]">
                <input type="checkbox" className="my-0 h-[16px] w-[16px]" />
                <h4 className="text-sm font-normal text-[#101828]">
                  Remember me
                </h4>
              </div>
              <Link
                href="/admin/forgot-password"
                className="text-sm font-normal text-[#FF8A00]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              className=" bg-[#FF8A00] text-base font-medium w-[85%] py-3 flex justify-center items-center text-[#fff]  "
              type="submit"
              data-te-ripple-init=""
              data-te-ripple-color="light"
            >
              Sign in{" "}
            </button>

            <div className="mt-[50px]">
              <h4 className="text-sm font-normal text-[#868686]">
                Don’t have an account?{" "}
                <span className="text-[#FF8A00]">Sign Up as a</span>
              </h4>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
