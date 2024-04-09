import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/use-toast";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ToastAction } from "@/components/ui/toast";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainUrl } from "../../Config";
import { validationCreateUserSchema } from "@/app/ValidationScema/Index";
import CompanyUserApi from "@/CompanyUserApi";

function CreateUser({
  setIndividualUsers,
  setContractorUsers,
  setBusinessUsers,
}) {
  const { toast } = useToast();

  const [annualVolume, setAnnualVolume] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contactNo: "",
      userType: "",
    },
    validationSchema: validationCreateUserSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(`${mainUrl}/admin/user-signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const responseData = await response.json();
          setIndividualUsers((prev) => [...prev, responseData]);
          setBusinessUsers((prev) => [...prev, responseData]);
          setContractorUsers((prev) => [...prev, responseData]);
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

  const fetchAnnualVolumeData = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/annual-volume-list`,
        "GET"
      );

      if (data.status === true) {
        setAnnualVolume(data?.annualVolume?.options);
      } else {
        setError("Failed to fetch user options");
      }
    } catch (error) {
      setError("Error fetching user options:" + error.message);
    }
  };

  useEffect(() => {
    const fetchUserOptions = async () => {
      try {
        const data = await CompanyUserApi(`${mainUrl}/user/countries`, "GET");

        if (data.status === true) {
          setCountryData(data.countries?.filter((item) => item?.phone_code));
        } else {
          setError("Failed to fetch user options");
        }
      } catch (error) {
        setError("Error fetching user options:" + error.message);
      }
    };
    fetchAnnualVolumeData();
    fetchUserOptions();
  }, []);

  return (
    <>
      <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#FF8A00] text-white rounded-[5px] hover:bg-none  hover:border hover:border-[#FF8A00]"
          >
            User SignUp
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="justify-center">
            <div
              className="lg:w-[900px] w-full relative pt-8 px-5"
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
                        formik.resetForm(); // Reset the form when "Continue" is clicked
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DrawerTitle>Create User</DrawerTitle>

              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-5 mt-10"
              >
                <div className="grid  grid-cols-12 gap-4 ">
                  <div className=" col-span-4">
                    <Label htmlFor="firstName"> First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter First Name"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div className="text-red-500 text-xs ">
                        {formik.errors.firstName}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter Last Name"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.lastName}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="col-span-3"
                      placeholder="	
                  Enter Email Address"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid  grid-cols-12 gap-4 ">
                  <div className=" col-span-4 ">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter Password"
                        type={`${showPassword ? " text" : "password"}`}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {showPassword ? (
                        <Eye
                          className="absolute top-[6px] right-[10px] w-4"
                          onClick={() => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="absolute top-[6px] right-[10px] w-4"
                          onClick={() => {
                            setShowPassword(true);
                          }}
                        />
                      )}
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <div className=" col-span-4 ">
                    <Label htmlFor="confirmPassword">confirmPassword</Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter confirmPassword"
                        type={`${showPassword ? " text" : "confirmPassword"}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3"
                      />
                      {showPassword ? (
                        <Eye
                          className="absolute top-[6px] right-[10px] w-4"
                          onClick={() => {
                            showPassword(false);
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="absolute top-[6px] right-[10px] w-4"
                          // onClick={() => {
                          //   setShowconfirmPassword(true);
                          // }}
                        />
                      )}
                    </div>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.confirmPassword}
                        </div>
                      )}
                  </div>
                  <div className="col-span-4 relative">
                    <div className=" col-span-1  top-[23px] left-0 absolute ">
                      <Select
                        onValueChange={(value) => {
                          formik.setFieldValue("code", value); // Manually update Formik value
                          handleUserChange(value); // Optionally call your custom handler
                        }}
                        value={formik.values.code || ""}
                      >
                        <SelectTrigger className="w-full border-none">
                          <SelectValue placeholder={formik.values.code} />
                        </SelectTrigger>
                        <SelectContent>
                          {countryData.map((user, idx) => (
                            <SelectItem
                              key={`${idx}+${user.name}+${user.code}`}
                              value={user.phone_code}
                            >
                              {user.phone_code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className=" col-span-3">
                      <Label htmlFor="contactNo"> Contact Number</Label>
                      <Input
                        type="number"
                        placeholder="Enter Contact Number"
                        id="contactNo"
                        name="contactNo"
                        value={formik.values.contactNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="col-span-3 pl-[96px]"
                      />
                      {formik.touched.contactNo && formik.errors.contactNo && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.contactNo}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className=" col-span-4">
                    <Label htmlFor="userType"> User Type</Label>
                    <Select
                      onValueChange={(value) => {
                        formik.setFieldValue("userType", value); // Manually update Formik value
                      }}
                      value={formik.values.userType || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select UserType" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="individual">individual</SelectItem>
                          <SelectItem value="business_representative">
                            business_representative
                          </SelectItem>
                          <SelectItem value="contractor">contractor</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="annualVolumeOfChecks">
                      annualVolumeOfChecks
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        formik.setFieldValue("annualVolumeOfChecks", value);
                        handleAnnualVolumeOfChecks(value);
                      }}
                      value={formik.values.annualVolumeOfChecks || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={formik.values.annualVolumeOfChecks}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Users</SelectLabel>
                          {annualVolume?.map((user, idx) => (
                            <SelectItem key={`${idx}-${user}`} value={user}>
                              {user}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DrawerFooter>
                  <Button
                    type="submit"
                    className="bg-[#FF8A00] rounded-[5px] text-[#fff]"
                  >
                    Create User
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

export default CreateUser;
