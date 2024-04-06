import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainUrl } from "../../Config";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import CompanyUserApi from "@/CompanyUserApi";
import { ProfileEditSchema } from "@/app/ValidationScema/Index";

function Popup({ setuserData, userData }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formikRef = useRef();
  const initialValues = {
    firstName: "",
    lastName: "",
    contactNo: "",
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const formik = (formikRef.current = useFormik({
    initialValues,
    validationSchema: ProfileEditSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await CompanyUserApi(
          `${mainUrl}/admin/edit`,
          "PUT",
          values
        );
        if (response.status === true) {
          toast({
            title: "Information updated successfully ",
            duration: 2000,
          });
          setuserData((prev) => ({
            ...prev,
            firstName: response.admin.firstName,
            lastName: response.admin.lastName,
            contactNo: response.admin.contactNo,
          }));

          formikRef.current.setValues({
            firstName: response.admin.firstName,
            lastName: response.admin.lastName,
            contactNo: response.admin.contactNo,
          });

          closeDialog();
        } else {
          console.error("Failed to update profile");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: `${error}`,
          duration: 2000,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        console.error("Error updating profile", error);
      }
    },
  }));
  const fetchData = async () => {
    try {
      const response = await CompanyUserApi(`${mainUrl}/admin/detail`, "GET");
      if (response && response.admin) {
        formikRef.current.setValues({
          firstName: response.admin.firstName,
          lastName: response.admin.lastName,
          contactNo: response.admin.contactNo,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetTrigger asChild>
          <div className="bg-[#FF8A00] rounded-[5px] flex justify-center items-center cursor-pointer gap-2 py-2 px-4 text-base font-semibold text-[#fff]">
            <Pencil className="w-4 " />
            Edit Profile
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="absolute right-4 cursor-pointer top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Cross2Icon className="h-4 w-4" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {" "}
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
                  <SheetClose asChild>
                    <AlertDialogAction className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0">
                      Continue
                    </AlertDialogAction>
                  </SheetClose>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you are done.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid py-4">
              <div className="">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter First Name"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  className="col-span-3"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-xs ">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>

              <div className="">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  placeholder="Enter Last Name"
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  className="col-span-3"
                />
              </div>
              {formik.errors.lastName && formik.touched.lastName && (
                <div className="text-red-500 text-xs">
                  {formik.errors.lastName}
                </div>
              )}
              <div className="">
                <Label htmlFor="contactNo" className="text-right">
                  Contact Number
                </Label>
                <Input
                  placeholder="Enter Contact Number"
                  id="contactNo"
                  name="contactNo"
                  value={formik.values.contactNo}
                  onChange={formik.handleChange}
                  className="col-span-3"
                />
              </div>
              {formik.errors.contactNo && formik.touched.contactNo && (
                <div className="text-red-500 text-xs">
                  {formik.errors.contactNo}
                </div>
              )}
            </div>

            <SheetFooter>
              {/* <SheetClose asChild> */}
              <Button
                type="submit"
                className="bg-[#FF8A00] rounded-[5px] text-[#fff]"
              >
                Save changes
              </Button>
              {/* </SheetClose> */}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Popup;
