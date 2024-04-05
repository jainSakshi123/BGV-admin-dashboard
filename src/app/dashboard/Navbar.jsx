"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import CompanyUserApi from "@/CompanyUserApi";
import { mainUrl } from "../Config";
import { User } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangePassword from "../admin/change-password/ChangePassword";

function Navbar() {
  const router = useRouter();
  const [data, setData] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = async () => {
    try {
      const data = await CompanyUserApi(`${mainUrl}/admin/logout`, "POST");
      if (data.status === true) {
        router.push("/admin/sign-in");
      }
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("companyLogo");
      Cookies.remove("companyName");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await CompanyUserApi(`${mainUrl}/admin/detail`, "GET");
      if (response.status === true) {
        setData(response.admin);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const capitalizedFirstName =
    data?.firstName.charAt(0).toUpperCase() +
    data?.firstName.slice(1).toLowerCase();
  const capitalizedLastName =
    data?.lastName.charAt(0).toUpperCase() +
    data?.lastName.slice(1).toLowerCase();

  return (
    <>
      <>
        <nav className=" top-0 left-0 z-50 w-full  border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 bg-[#fff]">
          <div className=" py-3 lg:px-5 px-3">
            <div className="flex items-center md:justify-between justify-end">
              <Button
                type="submit"
                className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0 md:block hidden"
              >
                Run a background check
              </Button>
              <div className="flex items-center">
                <div className="flex items-center ms-3">
                  <div className="flex items-center">
                    <div className="flex flex-col items-center ms-3 relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="w-[50px] cursor-pointer h-[50px] rounded-full border border-[#FF8A00] bg-[#FF8A00] flex justify-center items-center">
                              <User
                                style={{
                                  stroke: "#fff",
                                  fill: "#fff",
                                  width: "30px",
                                  height: "30px",
                                }}
                              />
                            </div>
                            <ChevronDown className="w-[15px]" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mt-5">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <Link
                              href="/dashboard/profile"
                              className="py-1"
                              role="menuitem"
                            >
                              <DropdownMenuItem className="block px-2 py-2 text-sm text-[#0a0a0a] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                                Profile
                              </DropdownMenuItem>
                            </Link>

                            {/* <a
                              className="block px-2 py-2 rounded-sm text-sm text-[#0a0a0a] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                              role="menuitem"
                            >
                              <ChangePassword />
                            </a> */}
                            {/* <DropdownMenuItem className="block px-2 py-2 text-sm text-[#0a0a0a] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"> */}
                            <AlertDialog>
                              <AlertDialogTrigger className="block  py-2 text-sm text-[#0a0a0a] hover:bg-gray-100 my-0 px-2 w-full text-left dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                                Sign out
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to sign out this page
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    SignOut this page.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-[#fff] rounded-[5px] text-[#FF8A00] border-[2px] border-[#FF8A00] my-0">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0"
                                    onClick={logout}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {/* </DropdownMenuItem> */}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="px-4 " role="none">
                        <p
                          className="text-base font-medium text-[#000000] dark:text-white"
                          role="none"
                        >
                          {capitalizedFirstName} {capitalizedLastName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
    </>
  );
}

export default Navbar;
