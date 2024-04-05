"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { validationCreateStoreSchema } from "@/app/ValidationScema/Index";
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
import TimeInput from "react-time-picker-input";
import "react-time-picker-input/dist/components/TimeInput.css";
import { RxCrossCircled } from "react-icons/rx";
import Select from "react-select";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

function CreateCompany({ setStores }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const getToken = () => {
    return Cookies.get("token") || null;
  };

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    let hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    hoursInt = hoursInt % 12 || 12;
    const time12Hour =
      hoursInt.toString().padStart(2, "0") + ":" + minutes + " " + suffix;
    return time12Hour;
  };

  const handleChangeOpeningTime = (time) => {
    const formattedTime = convertTo12HourFormat(time);
    setOpeningTime(formattedTime);
    formik.setFieldValue("openingTime", formattedTime);
  };

  const handleChangeClosingTime = (time) => {
    const formatteTime = convertTo12HourFormat(time);
    setClosingTime(formatteTime);
    formik.setFieldValue("closingTime", formatteTime);
  };

  const DaysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const formik = useFormik({
    initialValues: {
      storeName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: "",
      longitude: "",
      contactPersonEmail: "",
      phoneNumber: "",
      openingTime: "",
      closingTime: "",
      daysOfOperation: [],
      description: "",
      photo: null,
    },
    validationSchema: validationCreateStoreSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const {
          storeName,
          address,
          city,
          state,
          zipCode,
          latitude,
          longitude,
          contactPersonEmail,
          phoneNumber,
          openingTime,
          closingTime,
          daysOfOperation,
          description,
          photo,
        } = values;

        // The rest of your onSubmit logic...
        const token = getToken();
        if (!token) throw new Error("No auth token");

        const formData = new FormData();
        formData.append("storeName", storeName);
        formData.append("address", address);
        formData.append("city", city);
        formData.append("state", state);
        formData.append("zipCode", zipCode);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("contactPersonEmail", contactPersonEmail);
        formData.append("phoneNumber", phoneNumber);
        formData.append("openingTime", openingTime);
        formData.append("closingTime", closingTime);
        formData.append("daysOfOperation", JSON.stringify(daysOfOperation));
        formData.append("description", description);
        formData.append("photo", photo);
        const response = await fetch(`${mainUrl}/companyUser/create-store`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.status === true) {
          toast({
            title: "The Store has been created. ",
            duration: 2000,
          });
          setStores((prev) => [...prev, data.store]);
          resetForm();
          setOpeningTime("");
          setClosingTime("");
          setSelectedImage(null);
          closeDialog();
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
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("photo", file);
    setSelectedImage(file);
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("photo", null);
    setSelectedImage(null);
  };
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-black text-white">
            Create Store
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px] ">
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
                    setSelectedImage(null);
                    setClosingTime("");
                    setOpeningTime("");
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
                  <div className=" col-span-4">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      value={formik.values.storeName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                      placeholder="Enter Store Name"
                    />
                    {formik.touched.storeName && formik.errors.storeName && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.storeName}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="storeName">Store Address</Label>
                    <Input
                      placeholder="Enter Store Address"
                      id="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.address}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="city">City</Label>
                    <Input
                      placeholder="Enter City Name"
                      id="city"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.city}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid  grid-cols-12 gap-4 ">
                  <div className=" col-span-4">
                    <Label htmlFor="state">State</Label>
                    <Input
                      placeholder="Enter State"
                      id="state"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.state && formik.errors.state && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.state}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      placeholder="Enter Zip Code"
                      id="zipCode"
                      name="zipCode"
                      value={formik.values.zipCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.zipCode && formik.errors.zipCode && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.zipCode}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      type="number"
                      placeholder="Enter Latitude"
                      id="latitude"
                      name="latitude"
                      value={formik.values.latitude}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.latitude && formik.errors.latitude && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.latitude}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid  grid-cols-12 gap-4 ">
                  <div className=" col-span-4">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      type="number"
                      placeholder="Enter Longitude"
                      id="longitude"
                      name="longitude"
                      value={formik.values.longitude}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.longitude && formik.errors.longitude && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.longitude}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="contactPersonEmail">Email</Label>
                    <Input
                      id="contactPersonEmail"
                      name="contactPersonEmail"
                      value={formik.values.contactPersonEmail}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                      placeholder="Enter Email"
                    />
                    {formik.touched.contactPersonEmail &&
                      formik.errors.contactPersonEmail && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.contactPersonEmail}
                        </div>
                      )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="phoneNumber">Contact Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter Contact Number"
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.phoneNumber}
                        </div>
                      )}
                  </div>
                </div>
                <div className="grid  grid-cols-12 gap-4 ">
                  <div className=" col-span-4">
                    <Label htmlFor="openingTime">Opening Time</Label>
                    <TimeInput
                      value={openingTime}
                      eachInputDropdown
                      onChange={handleChangeOpeningTime}
                      allowDelete
                    />
                    {formik.touched.openingTime &&
                      formik.errors.openingTime && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.openingTime}
                        </div>
                      )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="closingTime">Closing Time</Label>
                    <TimeInput
                      hour12Format
                      value={closingTime}
                      eachInputDropdown
                      onChange={handleChangeClosingTime}
                      allowDelete
                    />
                    {formik.touched.closingTime &&
                      formik.errors.closingTime && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.closingTime}
                        </div>
                      )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="openingTime">Open Days</Label>
                    <Select
                      className="my-2 focus-visible:ring-1 focus-visible:ring-ring"
                      isMulti
                      options={DaysOfWeek}
                      value={DaysOfWeek.filter((option) =>
                        formik.values.daysOfOperation.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        formik.setFieldValue(
                          "daysOfOperation",
                          selectedOptions.map((option) => option.value)
                        );
                      }}
                    />
                    {formik.touched.daysOfOperation &&
                      formik.errors.daysOfOperation && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.daysOfOperation}
                        </div>
                      )}
                  </div>
                </div>
                <div className="grid  grid-cols-12 gap-4 ">
                  <div className=" col-span-4">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      placeholder="Enter Description"
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
                  <div className="col-span-8 flex ">
                    <div>
                      <div className="mr-5">
                        <label htmlFor="photo">Store Image</label>
                        <div className="relative">
                          <div className="cursor-pointer absolute top-0 right-0 bottom-0 left-0 w-full h-full flex justify-start pl-[15px] items-center border border-[#c9c9c9] z-[-1] rounded-[6px]">
                            <p className="text-normal font-normal text-[#6a6969]">
                              Click to upload
                            </p>
                          </div>
                          <Input
                            id="photo"
                            name="photo"
                            className="form-control opacity-0 cursor-pointer"
                            type="file"
                            accept=".jpg, .jpeg, .svg, .png"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </div>
                      {formik.touched.photo && formik.errors.photo && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.photo}
                        </div>
                      )}
                    </div>
                    {selectedImage && (
                      <div className="border border-[#cac8c8] rounded-md w-[110px] h-[110px] flex justify-center items-center relative">
                        <Image
                          height={100}
                          width={100}
                          className="w-[100px] h-[100px] object-contain"
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                        />
                        <RxCrossCircled
                          className="top-[6px] right-[6px] absolute"
                          onClick={handleRemoveImage}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Create Store</Button>
              </DialogFooter>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateCompany;
