"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { validationGetOptions } from "@/app/ValidationScema/Index";
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

function AddVolume({
  setAnnualVolume,
  postData,
  // setBusinessOrg,
  // setContractorOrg,
}) {
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
      options: "",
    },
    validationSchema: validationGetOptions,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(postData, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const responseData = await response.json();
          setAnnualVolume((prev) => [
            ...(Array.isArray(prev) ? prev : []), // Ensure prev is an array
            responseData.businessOrgStrength?.options,
          ]);
          setAnnualVolume((prev) => [
            ...(Array.isArray(prev) ? prev : []), // Ensure prev is an array
            responseData.contractorOrgStrength?.options,
          ]);
          setAnnualVolume((prev) => [
            ...(Array.isArray(prev) ? prev : []), // Ensure prev is an array
            responseData.annualVolume?.options,
          ]);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="inline-flex hover:bg-[#f59e0b] hover:text-[#000] items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 edit capitalize bg-[#f59e0b]  text-white rounded-md"
          >
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] ">
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
                  Closing the dialog box will discard the information. Are you
                  certain you want to proceed?
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
          <DialogHeader className="mb-5">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-5"
            >
              <div className="  ">
                <div className="grid  grid-cols-12 gap-4 ">
                  <div className=" col-span-12">
                    <Label htmlFor="options">Options</Label>
                    <Input
                      id="options"
                      name="options"
                      value={formik.values.options}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                      placeholder="Enter Options"
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
                  className="bg-[#FF8A00] rounded-[5px] text-[#fff]"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddVolume;
