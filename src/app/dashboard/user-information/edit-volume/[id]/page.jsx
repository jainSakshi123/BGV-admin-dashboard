"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import { Label } from "@/components/ui/label";
import { mainUrl } from "@/app/Config";
import Select from "react-select";
import { validationGetOptions } from "@/app/ValidationScema/Index";
import { useRouter } from "next/navigation";
import CompanyUserApi from "@/CompanyUserApi";
import Cookies from "js-cookie";
import { RxCrossCircled } from "react-icons/rx";
import TimeInput from "react-time-picker-input";
import "react-time-picker-input/dist/components/TimeInput.css";

function EditStore({ params }) {
  const formikRef = useRef();
  const { toast } = useToast();
  const router = useRouter();

  const getToken = () => {
    return Cookies.get("token") || null;
  };

  const formik = (formikRef.current = useFormik({
    initialValues: {
      options: "",
    },

    validationSchema: validationGetOptions,

    onSubmit: async (values) => {
      try {
        const { options } = values;
        const token = getToken();
        if (!token) throw new Error("No auth token");

        const response = await fetch(
          `${mainUrl}/admin/edit-annual-volume/${params}/options/11-26`,
          {
            method: "PUT",
            body: JSON.stringify({ options }),
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
            title: "The annual volume has been updated successfully.",
            duration: 2000,
          });
        } else {
          console.error("Error Volume:", data.message);
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
  useEffect(() => {
    const fetchStoreById = async () => {
      try {
        const data = await CompanyUserApi(
          `${mainUrl}/admin/annual-volume-list/${params}/options/11-26`,
          "GET"
        );
        if (data.status === true) {
          const { options } = data;

          formikRef.current.setValues({
            options,
          });
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };

    fetchStoreById();
  }, [params.id]);

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
                <Label htmlFor="options">Options</Label>
                <Input
                  id="options"
                  name="options"
                  placeholder="Enter options"
                  value={formik.values.options}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2"
                  disabled={formik.values.placeId !== undefined}
                />
                {formik.touched.options && formik.errors.options && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.options}
                  </div>
                )}
              </div>
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

export default EditStore;
