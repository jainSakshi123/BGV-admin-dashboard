"use client";
import React, { useState, useRef, useEffect } from "react";
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
function EditDrpdown({ params, option, setContractorOrg, apiURL }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const formikRef = useRef();
  const { toast } = useToast();
  const getToken = () => {
    return Cookies.get("token") || null;
  };

  const formik = (formikRef.current = useFormik({
    initialValues: {
      newOption: option,
    },

    validationSchema: validationGetOptions,

    onSubmit: async (values) => {
      try {
        const { newOption } = values;
        const token = getToken();
        if (!token) throw new Error("No auth token");

        const response = await fetch(
          `${mainUrl}/${apiURL}/${params}/options/${option}`,
          {
            method: "PUT",
            body: JSON.stringify({ newOption }),
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.status === true) {
          setContractorOrg((prev) => {
            if (Array.isArray(prev)) {
              return [...prev, data.contractorOrgStrength];
            } else {
              return [];
            }
          });
          toast({
            title: "The data has been updated successfully.",
            duration: 2000,
          });
          closeDialog();
          handleBackClick();
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

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#000] text-white rounded-[5px] border-none hover:border hover:border-[#FF8A00] "
          >
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className=" ">
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
              <div className="grid  grid-cols-12 gap-4 ">
                <div className=" col-span-12">
                  <div>
                    <Label htmlFor="newOption">newOption</Label>
                    <Input
                      id="newOption"
                      name="newOption"
                      placeholder="Enter newOption"
                      // value={option}
                      defaultValue={option}
                      value={formik.values.newOption}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3 mt-2"
                      disabled={formik.values.placeId !== undefined}
                    />
                    {formik.touched.newOption && formik.errors.newOption && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.newOption}
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
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditDrpdown;
