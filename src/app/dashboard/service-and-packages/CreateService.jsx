"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { validationCreateServiceSchema } from "@/app/ValidationScema/Index";
import Cookies from "js-cookie";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ToastAction } from "@/components/ui/toast";
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
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainUrl } from "@/app/Config";
import "react-time-picker-input/dist/components/TimeInput.css";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

function CreateService({ setStores, packageID }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const getToken = () => {
    return Cookies.get("token") || null;
  };

  const formik = useFormik({
    initialValues: {
      serviceName: "",
      price: "",
      description: "",
    },
    validationSchema: validationCreateServiceSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${mainUrl}/admin/add-services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const responseData = await response.json();
          setStores((prev) => [...prev, responseData.service]);
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
            className="bg-[#FF8A00] text-white rounded-[5px] border-none hover:border hover:border-[#FF8A00] absolute top-[11px] right-0"
          >
            Create Service
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
                    <div className=" col-span-6">
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        name="serviceName"
                        value={formik.values.serviceName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                        placeholder="Enter Service Name"
                      />
                      {formik.touched.serviceName &&
                        formik.errors.serviceName && (
                          <div className="text-red-500 text-xs">
                            {formik.errors.serviceName}
                          </div>
                        )}
                    </div>
                    <div className=" col-span-6">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        type="text"
                        placeholder="Enter Price"
                        id="price"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {formik.touched.price && formik.errors.price && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.price}
                        </div>
                      )}
                    </div>
                    <div className=" col-span-12">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        placeholder="Enter description "
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <div className="text-red-500 text-xs">
                            {formik.errors.description}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button
                    type="submit"
                    className="bg-[#FF8A00] rounded-[5px] text-[#fff]"
                  >
                    Create Service
                  </Button>
                </DrawerFooter>
              </form>
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default CreateService;
