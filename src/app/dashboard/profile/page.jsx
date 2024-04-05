"use client";
import React, { useEffect, useState } from "react";
import { mainUrl } from "../../Config";
import Popup from "./Popup";
import CompanyUserApi from "@/CompanyUserApi";
import Image from "next/image";
import { User } from "lucide-react";

function AdminProfile() {
  const [userData, setuserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const AdminResponse = await CompanyUserApi(
        `${mainUrl}/admin/detail`,
        "GET"
      );
      if (AdminResponse.status === true) {
        setuserData(AdminResponse.admin);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const capitalizedFirstName =
    userData?.firstName.charAt(0).toUpperCase() +
    userData?.firstName.slice(1).toLowerCase();
  const capitalizedLastName =
    userData?.lastName.charAt(0).toUpperCase() +
    userData?.lastName.slice(1).toLowerCase();
  return (
    <>
      <div className="flex flex-col gap-5 mt-4  w-full">
        <div className="py-6 w-full">
          <div
            className="flex flex-col  justify-between items-center md:items-start mx-auto gap-2 p-8  rounded-[25px] border-2 bg-[#FFFFFF] border-white"
            style={{ boxShadow: "0px 0px 3px #00000033" }}
          >
            <div className="flex justify-between items-center w-full border-b border-b-[#E0E0E0]  pb-8">
              <div className="mb-3 md:mb-0   gap-4 flex   md:justify-start justify-center items-center ">
                <div className="w-[80px] h-[80px] rounded-full border border-[#d5d5d5] bg-[#e5e5e5] flex justify-center items-center">
                  <User
                    style={{ stroke: "#6f6c6c", width: "35px", height: "35px" }}
                  />
                </div>

                <div className="font-semibold text-[#101828] text-[24px]">
                  {loading
                    ? "Loading..."
                    : (userData &&
                        `${capitalizedFirstName} ${capitalizedLastName}`) ||
                      "No Data"}
                </div>
              </div>
              <Popup setuserData={setuserData} userData={userData} />
            </div>
            <div className=" py-6 w-full">
              <div className="flex justify-between items-center mb-8">
                <h5 className="text-[#101828] font-semibold text-[24px]">
                  About
                </h5>
              </div>
              <div className="lg:flex grid grid-cols-12  justify-between items-center    ">
                <div className="md:col-span-6 col-span-12">
                  <div className="col-span-full font-normal text-lg text-[#667085] ">
                    Name
                  </div>
                  <div className="col-span-full md:col-span-1 mt-2 font-medium capitalize text-[#101828]     text-lg  ">
                    {userData
                      ? `${capitalizedFirstName} ${capitalizedLastName}`
                      : "Loading..."}
                  </div>
                </div>

                <div className=" md:col-span-6 col-span-12">
                  <div>
                    <div className="col-span-full font-normal text-lg text-[#667085]">
                      Contact number
                    </div>
                    <div className="col-span-full md:col-span-1 mt-2 font-medium capitalize text-[#101828]     text-lg  ">
                      {userData ? userData.contactNo : "Loading..."}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-6 col-span-12">
                  <div className="col-span-full font-normal text-lg text-[#667085]">
                    Email Id
                  </div>
                  <div className="col-span-full md:col-span-1 mt-2 font-medium capitalize text-[#101828]     text-lg  ">
                    {userData ? userData.email : "Loading..."}
                  </div>
                </div>
                <div className="md:col-span-6 col-span-12">
                  <div className="col-span-full font-normal text-lg text-[#667085]">
                    User Type
                  </div>
                  <div className="col-span-full md:col-span-1 mt-2 font-medium capitalize text-[#101828]     text-lg  ">
                    {userData ? userData.userType : "Loading..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProfile;
