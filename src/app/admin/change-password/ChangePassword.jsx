import React, { useState } from "react";
import { useFormik } from "formik";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainUrl } from "../../Config";
import { useRouter } from "next/navigation";
import CompanyUserApi from "@/CompanyUserApi";
import Cookies from "js-cookie";
import { CahngePasswordSchema } from "@/app/ValidationScema/Index";

function ChangePassword() {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const token = Cookies.get("token");

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const initialValues = {
    oldPassword: "",
    newPassword: "",
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const closeConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleConfirmation = () => {
    closeConfirmationDialog();
    router.push("/admin/sign-in");
  };

  const formik = useFormik({
    initialValues,
    validationSchema: CahngePasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await CompanyUserApi(
          `${mainUrl}/companyUser/change-password`,
          "POST",
          values
        );

        if (response.status === true) {
          resetForm();
          closeDialog();
          setIsConfirmationDialogOpen(true);
        } else if (response.status === false) {
          alert(response.message);
          console.error("Failed to change password");
        }
      } catch (error) {
        alert(error);
      }
    },
  });

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <p className="cursor-pointer">Change Password</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[578px]">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="my-0"
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
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your Current and new password. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4 relative">
              <div className="">
                <Label htmlFor="oldPassword" className="text-right">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange}
                    className="col-span-3"
                    placeholder="Enter Current Password"
                  />

                  <button
                    type="button"
                    className="absolute top-[8px] right-5 transform -translate-y-1/2 cursor-pointer"
                    onClick={toggleShowCurrentPassword}
                  >
                    {showCurrentPassword ? <IoMdEyeOff /> : <IoEye />}
                  </button>
                </div>
                {formik.touched.oldPassword && formik.errors.oldPassword ? (
                  <div className="text-red-500  text-xs">
                    {formik.errors.oldPassword}
                  </div>
                ) : null}
              </div>

              <div className=" relative">
                <Label htmlFor="newPassword" className="text-right">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter New Password"
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    className="col-span-3"
                  />

                  <button
                    type="button"
                    className="absolute top-[8px] right-5 transform -translate-y-1/2 cursor-pointer"
                    onClick={toggleShowNewPassword}
                  >
                    {showNewPassword ? <IoMdEyeOff /> : <IoEye />}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.newPassword}
                  </div>
                ) : null}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Changed</DialogTitle>
            <DialogDescription>
              Your password has been changed successfully. Click OK to login
              again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="mt-5" onClick={handleConfirmation}>
              OK
            </Button>
            <DialogClose>
              <Button onClick={closeConfirmationDialog}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChangePassword;
