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
import { validationCreateServiceSchema } from "@/app/ValidationScema/Index";
import { useRouter } from "next/navigation";
import CompanyUserApi from "@/CompanyUserApi";
import Cookies from "js-cookie";
import "react-time-picker-input/dist/components/TimeInput.css";
import { Textarea } from "@/components/ui/textarea";

function Page({ params }) {
  const formikRef = useRef();
  const { toast } = useToast();
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);

  const getToken = () => {
    return Cookies.get("token") || null;
  };

  const formik = (formikRef.current = useFormik({
    initialValues: {
      serviceName: "",
      description: "",
      price: "",
    },

    validationSchema: validationCreateServiceSchema,

    onSubmit: async (values) => {
      try {
        const { serviceName, description, price } = values;
        const token = getToken();
        if (!token) throw new Error("No auth token");

        const response = await fetch(
          `${mainUrl}/admin/edit-services/${params.serviceID}`,
          {
            method: "PUT",
            body: JSON.stringify({ serviceName, description, price }),
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
            title: "The service information has been updated successfully.",
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
        `${mainUrl}/admin/get-services/${params.serviceID}`,
        "GET"
      );
      if (data.status === true) {
        const { serviceName, description, price } = data.service;

        formikRef.current.setValues({
          serviceName,
          description,
          price,
        });
      }
    } catch (error) {
      console.error("Error fetching store details:", error);
    }
  };
  useEffect(() => {
    fetchStoreById();
  }, [params.serviceID]);
  const handleChange = (event) => {
    const value = event.target.value;
    setCharCount(value.length); // Update character count
    // If you're also using formik, you can call formik.handleChange here
  };
  return (
    <>
      <div className=" gap-5 mt-4  w-full">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-5 p-5 shadow-md rounded-md border border-[#0000000f]"
        >
          <div className="grid  grid-cols-12 gap-4 ">
            <div className=" col-span-6">
              <div>
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  name="serviceName"
                  value={formik.values.serviceName}
                  onChange={formik.handleChange}
                  placeholder="Enter Service Name"
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2"
                  disabled={formik.values.placeId !== undefined}
                />
                {formik.touched.serviceName && formik.errors.serviceName && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.serviceName}
                  </div>
                )}
              </div>
            </div>

            <div className=" col-span-6">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  placeholder="Enter Price"
                  value={`$${formik.values.price}`}
                  onChange={(e) => {
                    let price = e.target.value.replace(/[^0-9.]/g, "");
                    const [integerPart, decimalPart] = price.split(".");
                    if (decimalPart) {
                      price = `${integerPart}.${decimalPart.slice(0, 2)}`;
                    }
                    formik.handleChange({
                      target: {
                        id: "price",
                        name: "price",
                        value: `${price}`,
                      },
                    });
                  }}
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2"
                  disabled={formik.values.placeId !== undefined}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.price}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" col-span-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={(e) => {
                  handleChange(e);
                  formik.handleChange(e);
                }}
                placeholder="Enter Description"
                onBlur={formik.handleBlur}
                className="col-span-3 mt-2"
                disabled={formik.values.placeId !== undefined}
                maxLength={100}
              />
              <div className="text-[#939393] text-xs">
                Character Count: {charCount}
              </div>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-xs">
                  {formik.errors.description}
                </div>
              )}
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
