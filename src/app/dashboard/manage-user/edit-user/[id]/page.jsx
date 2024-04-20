"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainUrl } from "@/app/Config";
import { validationUserSchema } from "@/app/ValidationScema/Index";
import { useRouter } from "next/navigation";
import CompanyUserApi from "@/CompanyUserApi";
import Cookies from "js-cookie";
import "react-time-picker-input/dist/components/TimeInput.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Page({ params }) {
  const [annualVolume, setAnnualVolume] = useState([]);
  const formikRef = useRef();
  const { toast } = useToast();
  const router = useRouter();
  const getToken = () => {
    return Cookies.get("token") || null;
  };
  const fetchAnnualVolumeData = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/annual-volume-list`,
        "GET"
      );

      if (data.status === true) {
        setAnnualVolume(data?.annualVolume?.options);
      } else {
        setError("Failed to fetch user options");
      }
    } catch (error) {
      setError("Error fetching user options:" + error.message);
    }
  };
  const formik = (formikRef.current = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      contactNo: "",
      annualVolumeOfChecks: "",
    },
    validationSchema: validationUserSchema,
    onSubmit: async (values) => {
      try {
        const { firstName, lastName, contactNo, annualVolumeOfChecks } = values;
        const token = getToken();
        if (!token) throw new Error("No auth token");
        const response = await fetch(
          `${mainUrl}/admin/edit-user/${params.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              firstName,
              lastName,
              contactNo,
              annualVolumeOfChecks,
            }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.status === true) {
          handleBackClick();
          toast({
            title: "The user information has been updated successfully.",
            duration: 2000,
          });
        } else {
          console.error("Error adding company and user:", data.message);
          toast({
            variant: "destructive",
            title: `${data.message}`,
            duration: 2000,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  }));
  const handleBackClick = () => {
    router.back();
  };
  const fetchStoreById = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/get-users/${params.id}`,
        "GET"
      );
      console.log(data, "data>>>>>>>>>>>>>");
      if (data.status === true) {
        const { firstName, lastName, contactNo, annualVolumeOfChecks } =
          data.user;
        console.log(data.user, "data.user");
        formikRef.current.setValues({
          firstName,
          lastName,
          contactNo,
          annualVolumeOfChecks,
        });
      }
    } catch (error) {
      console.error("Error fetching store details:", error);
    }
  };
  useEffect(() => {
    fetchAnnualVolumeData();
    fetchStoreById();
  }, [params.id]);
  console.log(formik.values.annualVolumeOfChecks, "formik.values.firstName");
  return (
    <>
      <div className=" gap-5 mt-4  w-full">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-5 p-5 shadow-md rounded-md border border-[#0000000f]"
        >
          <div className="grid  grid-cols-12 gap-4 ">
            <div className=" col-span-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  placeholder="Enter First Name"
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2"
                  disabled={formik.values.placeId !== undefined}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
            </div>
            <div className=" col-span-4">
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  placeholder="Enter lastName"
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2"
                  disabled={formik.values.placeId !== undefined}
                  maxLength={100}
                />

                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
            </div>
            <div className=" col-span-4">
              <div>
                <Label htmlFor="contactNo">contact Number</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  placeholder="Enter contactNo"
                  value={`${formik.values.contactNo}`}
                  onChange={(e) => {
                    let contactNo = e.target.value.replace(/[^0-9.]/g, "");

                    formik.handleChange({
                      target: {
                        id: "contactNo",
                        name: "contactNo",
                        value: `${contactNo}`,
                      },
                    });
                  }}
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2"
                  disabled={formik.values.placeId !== undefined}
                />
                {formik.touched.contactNo && formik.errors.contactNo && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.contactNo}
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-4">
              <Label htmlFor="annualVolumeOfChecks">annualVolumeOfChecks</Label>
              <Select
                onValueChange={(value) => {
                  formik.setFieldValue("annualVolumeOfChecks", value);
                  handleAnnualVolumeOfChecks(value);
                }}
                value={formik.values.annualVolumeOfChecks}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select annual Volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    {annualVolume?.map((user, idx) => (
                      <SelectItem key={`${idx}-${user}`} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0"
            >
              Save details
            </Button>
          </DialogFooter>
        </form>
      </div>
    </>
  );
}

export default Page;
