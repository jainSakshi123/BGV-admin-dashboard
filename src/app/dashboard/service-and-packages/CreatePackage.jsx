"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { validationPackageEditSchema } from "@/app/ValidationScema/Index";
import Cookies from "js-cookie";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ToastAction } from "@/components/ui/toast";
import CompanyUserApi from "@/CompanyUserApi";
import Select from "react-select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainUrl } from "@/app/Config";
import "react-time-picker-input/dist/components/TimeInput.css";
import { useToast } from "@/components/ui/use-toast";
function CreatePackage({ setStores }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceData, setServiceData] = useState([]);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const GetUsers = async () => {
    try {
      const data = await CompanyUserApi(`${mainUrl}/admin/get-services`, "GET");

      if (data.status === true) {
        setServiceData(data.services);
      } else {
        console.error("API call was not successful:", data.error);
      }
    } catch (error) {
      setServiceData([]);

      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    GetUsers();
  }, []);

  const getToken = () => {
    return Cookies.get("token") || null;
  };
  const options = serviceData?.map((value) => ({
    serviceId: value._id,
    value: value.serviceName,
    label: value.serviceName,
  }));
  const formik = useFormik({
    initialValues: {
      title: "",
      pricing: "",
      serviceIds: [],
    },
    validationSchema: validationPackageEditSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${mainUrl}/admin/add-packages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const responseData = await response.json();

          GetUsers();
          setStores((prev) => [...prev, responseData.package]);
          resetForm();
          closeDialog();
          toast({
            title: "The User has been created. ",
            duration: 2000,
          });
        } else {
          const errorResponse = await response.json();
          toast({
            variant: "destructive",
            title: `${errorResponse.message}`,
            duration: 2000,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } catch (error) {
        alert(error.message);
      }
    },
  });

  return (
    <>
      <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DrawerTrigger>
          <Button
            variant="outline"
            className="bg-[#FF8A00] text-white rounded-[5px] border-none hover:border hover:border-[#FF8A00]  top-[11px] right-0"
          >
            Create Package
          </Button>
        </DrawerTrigger>
        <DrawerContent className="justify-center">
          <DrawerHeader className="flex justify-center">
            <div
              className="md:w-[500px] w-full relative pt-8 px-5"
              style={{ boxShadow: "0px 0px 4px #c8c8c8" }}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <Cross2Icon className="h-4 w-4" />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to leave?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Closing the dialog box will discard the information. Are
                      you certain you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#fff] rounded-[5px] text-[#FF8A00] border-[2px] border-[#FF8A00] my-0">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0"
                      onClick={() => {
                        closeDialog();
                        formik.resetForm();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-5"
              >
                <div className="  ">
                  <div className="grid  grid-cols-12 gap-4 ">
                    <div className=" col-span-12">
                      <Label>Service Name</Label>
                      <Select
                        className="my-[10px]"
                        closeMenuOnSelect={false}
                        options={options}
                        isMulti
                        onChange={(selectedOptions) => {
                          formik.setFieldValue(
                            "serviceIds",
                            selectedOptions.map((option) => option.serviceId)
                          );
                        }}
                      />
                    </div>
                    <div className=" col-span-6">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-6"
                        placeholder="Enter Service Name"
                      />
                      {formik.touched.title && formik.errors.title && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.title}
                        </div>
                      )}
                    </div>
                    <div className=" col-span-6">
                      <Label htmlFor="pricing">Price</Label>
                      <Input
                        type="text"
                        placeholder="Enter pricing"
                        id="pricing"
                        name="pricing"
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
                        className="col-span-3"
                      />
                      {formik.touched.pricing && formik.errors.pricing && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.pricing}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-[#FF8A00] rounded-[5px] text-[#fff]"
                  >
                    Create Package
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default CreatePackage;
