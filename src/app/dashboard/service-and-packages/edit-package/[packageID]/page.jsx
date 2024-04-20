"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainUrl } from "@/app/Config";
import { validationPackageEditSchema } from "@/app/ValidationScema/Index";
import { useRouter } from "next/navigation";
import CompanyUserApi from "@/CompanyUserApi";
import Cookies from "js-cookie";
import "react-time-picker-input/dist/components/TimeInput.css";
import Select from "react-select";

function Page({ params }) {
  const formikRef = useRef();
  const { toast } = useToast();
  const [selectedServiceValue, setSelectedServiceValue] = useState("");
  const router = useRouter();
  const [selectOptions, setSelectOptions] = useState([]);
  const getToken = () => {
    return Cookies.get("token") || null;
  };
  const formik = (formikRef.current = useFormik({
    initialValues: {
      title: "",
      pricing: "",
      services: [],
    },
    validationSchema: validationPackageEditSchema,
    onSubmit: async (values) => {
      try {
        const { title, pricing, services } = values;
        const token = getToken();
        if (!token) throw new Error("No auth token");

        const response = await fetch(
          `${mainUrl}/admin/edit-package/${params.packageID}`,
          {
            method: "PUT",
            body: JSON.stringify({ title, pricing, services }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.status === true) {
          formik.setFieldValue("services", selectedServiceValue);
          handleBackClick();
          toast({
            title: "The store information has been updated successfully.",
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
        `${mainUrl}/admin/get-packages/${params.packageID}`,
        "GET"
      );

      if (data.status === true) {
        const { title, pricing, services } = data.package;

        formikRef.current.setValues({
          title,
          pricing,
          services,
        });
      }
    } catch (error) {
      console.error("Error fetching store details:", error);
    }
  };
  const servicesValue = formik.values.services.map((value) => ({
    serviceId: value?.serviceId?._id,
    value: value?.serviceId?.serviceName,
    label: value?.serviceId?.serviceName,
  }));

  const options = selectOptions?.map((value) => ({
    serviceId: value?._id,
    value: value?.serviceName,
    label: value?.serviceName,
  }));

  const GetUsers = async () => {
    try {
      const data = await CompanyUserApi(`${mainUrl}/admin/get-services`, "GET");

      if (data.status === true) {
        setSelectOptions(data.services);
      } else {
        console.error("API call was not successful:", data.error);
      }
    } catch (error) {
      setSelectOptions([]);

      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchStoreById();
    GetUsers();
  }, [params.packageID]);

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
                <Label htmlFor="title">Package Name</Label>
                <Input
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  placeholder="Enter Store Name"
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2 min-h-[40px]"
                  disabled={formik.values.placeId !== undefined}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.title}
                  </div>
                )}
              </div>
            </div>
            <div className=" col-span-4">
              <div>
                <Label htmlFor="pricing">Pricing</Label>
                <Input
                  id="pricing"
                  name="pricing"
                  placeholder="Enter Store pricing"
                  value={`$${formik.values.pricing}`}
                  onChange={(e) => {
                    let price = e.target.value.replace(/[^0-9.]/g, "");
                    const [integerPart, decimalPart] = price.split(".");
                    if (decimalPart) {
                      price = `${integerPart}.${decimalPart.slice(0, 2)}`;
                    }
                    formik.handleChange({
                      target: {
                        id: "pricing",
                        name: "pricing",
                        value: `${price}`,
                      },
                    });
                  }}
                  onBlur={formik.handleBlur}
                  className="col-span-3 mt-2 min-h-[40px]"
                  disabled={formik.values.placeId !== undefined}
                />
                {formik.touched.pricing && formik.errors.pricing && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.pricing}
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-4">
              <Label htmlFor="title">Services Name</Label>
              <Select
                className="my-[10px]"
                closeMenuOnSelect={false}
                defaultValue={servicesValue}
                options={options}
                isMulti
                onChange={(selectedOptions) => {
                  const selectedServiceIds = selectedOptions.map(
                    (option) => option.serviceId
                  );

                  formik.setFieldValue("services", selectedServiceIds);
                  setSelectedServiceValue(selectedServiceIds);
                }}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0"
          >
            Save details
          </Button>
        </form>
      </div>
    </>
  );
}

export default Page;
