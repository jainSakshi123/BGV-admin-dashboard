"use client";
import React, { useState, useEffect } from "react";
import { mainUrl } from "@/app/Config";
import CreateUser from "./CreateUser";
import CompanyUserApi from "@/CompanyUserApi";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import IndividualUsers from "./IndividualUsers";
import BusinessUsers from "./BusinessUsers";
import ContractorUsers from "./ContractorUsers";

function Page() {
  const { toast } = useToast();
  const [individualUsers, setIndividualUsers] = useState([]);
  const [businessUsers, setBusinessUsers] = useState([]);
  const [contractorUsers, setContractorUsers] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchData, setSearchData] = useState("");

  const columns = [
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const fullName = (
          row.original.firstName +
          " " +
          row.original.lastName
        ).toLowerCase();

        return (
          <div className="capitalize py-3 font-medium text-base text-[#637381]">
            {fullName}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const email = row.getValue("email");
        const truncatedemail =
          email?.length > 20 ? `${email.slice(0, 45)}...` : email;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="font-medium text-base text-[#637381]">
                  {truncatedemail}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="">{email}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "contactNo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            contactNo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize font-medium text-base text-[#637381]">
            {row.getValue("contactNo")}
          </div>
        );
      },
    },
    {
      accessorKey: "annualVolumeOfChecks",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            annualVolumeOfChecks
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize font-medium text-base text-[#637381]">
            {row.getValue("annualVolumeOfChecks")}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const GetCompanyUsers = async () => {
      try {
        const data = await CompanyUserApi(
          `${mainUrl}/admin/get-users?page=${page}&search=${searchData}`,
          "GET"
        );

        if (data.status === true) {
          setIndividualUsers(data.allUsers.individualUsers);
          setBusinessUsers(data.allUsers.businessUsers);
          setContractorUsers(data.allUsers.contractorUsers);
          setShowSkeleton(false);
          setTotalPages(data?.totalPages);
        }
      } catch (error) {
        setusers([]);
        setShowSkeleton(false);
        console.error("Error fetching data:", error);
      }
    };

    const reload = () => {
      if (individualUsers.length + 1) {
        GetCompanyUsers();
      }
    };

    reload();

    GetCompanyUsers();
  }, [page, individualUsers.length, searchData]);

  const handleDelete = async (userId) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/companyUser/delete-user/${userId}`,
        "DELETE"
      );

      if (data.status === true) {
        const updatedUsers = users.filter((user) => user._id !== userId);
        toast({
          title: "The user has been deleted successfully ",
          duration: 2000,
        });
        setusers(updatedUsers);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div className="  text-left md:absolute top-[94px] right-[30px]">
        <CreateUser
          setIndividualUsers={setIndividualUsers}
          setBusinessUsers={setBusinessUsers}
          setContractorUsers={setContractorUsers}
        />
      </div>

      <Accordion
        type="single"
        defaultValue="item-1"
        collapsible
        className="w-full"
      >
        <AccordionItem
          value="item-1"
          className="mb-5 border  rounded-md px-4"
          style={{ boxShadow: "0px 0px 5px #00000024" }}
        >
          <AccordionTrigger className="font-semibold text-[#667085] text-[18px]">
            <div className="flex w-[95%] items-center justify-between">
              <div className="flex justify-start items-center gap-6">
                <div className="">
                  <svg
                    width="25"
                    height="26"
                    viewBox="0 0 25 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.761 13.5952C16.7059 13.5952 19.9039 10.6638 19.9039 7.04762C19.9039 3.43147 16.7059 0.5 12.761 0.5C8.81613 0.5 5.61816 3.43147 5.61816 7.04762C5.61816 10.6638 8.81613 13.5952 12.761 13.5952Z"
                      fill="#667085"
                    />
                    <path
                      d="M14.4928 14.7861H11.0296C9.69346 14.7855 8.37027 15.0455 7.1357 15.5514C5.90113 16.0573 4.77937 16.7991 3.83457 17.7345C2.88977 18.6698 2.14045 19.7804 1.62944 21.0026C1.11843 22.2248 0.855764 23.5348 0.856447 24.8576V25.5004H24.666V24.8576C24.663 22.1874 23.5902 19.6274 21.683 17.7392C19.7758 15.8511 17.19 14.7891 14.4928 14.7861Z"
                      fill="#667085"
                    />
                  </svg>
                </div>
                Individual Users
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <IndividualUsers
              individualUsers={individualUsers}
              setIndividualUsers={setIndividualUsers}
              columns={columns}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              showSkeleton={showSkeleton}
              setSearchData={setSearchData}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className="mb-5 border  rounded-md px-4"
          style={{ boxShadow: "0px 0px 5px #00000024" }}
        >
          <AccordionTrigger className="font-semibold text-[#667085] text-[18px]">
            <div className="flex w-[95%] items-center justify-between">
              <div className="flex justify-start items-center gap-6">
                <div className="">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_361_1292)">
                      <path
                        d="M23.4167 5.70806H18.2083V4.66636C18.2083 3.51738 17.274 2.58301 16.125 2.58301H9.875C8.72603 2.58301 7.79165 3.51733 7.79165 4.66636V5.70801H2.58335C1.43433 5.70806 0.5 6.64238 0.5 7.79136V10.9164C0.5 12.0654 1.43433 12.9997 2.58335 12.9997H10.9167V12.4789C10.9167 12.4104 10.9301 12.3427 10.9563 12.2795C10.9824 12.2163 11.0208 12.1588 11.0692 12.1105C11.1175 12.0621 11.175 12.0237 11.2382 11.9976C11.3014 11.9714 11.3691 11.958 11.4375 11.958H14.5625C14.631 11.958 14.6987 11.9714 14.7619 11.9976C14.8251 12.0237 14.8826 12.0621 14.9309 12.1105C14.9793 12.1588 15.0177 12.2163 15.0438 12.2795C15.07 12.3427 15.0834 12.4104 15.0834 12.4789V12.9997H23.4167C24.5657 12.9997 25.5 12.0654 25.5 10.9164V7.79136C25.5 6.64238 24.5657 5.70806 23.4167 5.70806ZM16.125 5.70806H9.875V4.66636H16.125V5.70806ZM25.2111 13.5617C25.1242 13.5187 25.0271 13.5007 24.9306 13.5097C24.8341 13.5188 24.7421 13.5546 24.6648 13.6131C24.2945 13.8934 23.8632 14.0414 23.4166 14.0414H15.0833V15.6039C15.0834 15.6723 15.07 15.74 15.0438 15.8032C15.0176 15.8664 14.9793 15.9239 14.9309 15.9723C14.8825 16.0206 14.8251 16.059 14.7619 16.0852C14.6987 16.1113 14.6309 16.1248 14.5625 16.1247H11.4375C11.3691 16.1248 11.3013 16.1113 11.2381 16.0852C11.1749 16.059 11.1175 16.0206 11.0691 15.9723C11.0207 15.9239 10.9824 15.8664 10.9562 15.8032C10.93 15.74 10.9166 15.6723 10.9166 15.6039V14.0414H2.58335C2.13677 14.0414 1.70547 13.8934 1.33516 13.6131C1.25808 13.5541 1.16598 13.5181 1.06938 13.509C0.972784 13.4999 0.875577 13.5182 0.788867 13.5617C0.70208 13.6049 0.629062 13.6714 0.578028 13.7538C0.526995 13.8362 0.499972 13.9312 0.5 14.0282L0.5 21.3331C0.5 22.482 1.43433 23.4164 2.58335 23.4164H23.4167C24.5657 23.4164 25.5 22.4821 25.5 21.3331V14.0282C25.5001 13.9312 25.473 13.8362 25.422 13.7538C25.3709 13.6714 25.2979 13.6049 25.2111 13.5617Z"
                        fill="#667085"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_361_1292">
                        <rect
                          width="25"
                          height="25"
                          fill="white"
                          transform="translate(0.5 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                Business Users
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <BusinessUsers
              individualUsers={businessUsers}
              setIndividualUsers={setBusinessUsers}
              columns={columns}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              showSkeleton={showSkeleton}
              setSearchData={setSearchData}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-3"
          className="mb-5 border  rounded-md px-4"
          style={{ boxShadow: "0px 0px 5px #00000024" }}
        >
          <AccordionTrigger className="font-semibold text-[#667085] text-[18px]">
            <div className="flex w-[95%] items-center justify-between">
              <div className="flex justify-start items-center gap-6">
                <div className="">
                  <svg
                    width="22"
                    height="26"
                    viewBox="0 0 22 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.5488 11.0996C6.77656 12.58 7.92051 14.4642 9.7995 15.1268C10.5708 15.3959 11.4145 15.4011 12.1858 15.1216C14.0337 14.4538 15.2139 12.5749 15.4468 11.0996C15.6953 11.0789 16.0214 10.7321 16.3733 9.48463C16.8547 7.78164 16.3423 7.52801 15.9075 7.56942C15.9903 7.33648 16.0524 7.09838 16.0938 6.87062C16.8289 2.45527 14.6548 2.30516 14.6548 2.30516C14.6548 2.30516 14.2925 1.61154 13.3452 1.08874C12.7086 0.710868 11.8234 0.420997 10.6588 0.519346C10.2809 0.534875 9.92373 0.612519 9.58727 0.72122C9.15764 0.866156 8.76424 1.07838 8.40708 1.32684C7.97228 1.60119 7.55817 1.94282 7.19584 2.33104C6.62127 2.92113 6.10882 3.68204 5.88624 4.6293C5.6999 5.33845 5.74131 6.07865 5.89659 6.8758C5.938 7.10873 6.00012 7.34166 6.08294 7.57459C5.64813 7.53318 5.13568 7.78682 5.61708 9.48981C5.97424 10.7321 6.30034 11.0789 6.5488 11.0996Z"
                      fill="#667085"
                    />
                    <path
                      d="M19.5362 16.8914C16.8911 16.2185 14.743 14.707 14.743 14.707L13.0659 20.0127L12.7501 21.0117L12.7449 20.9962L12.4706 21.8451L11.5854 19.3346C13.7595 16.3013 11.1455 16.3324 11.0005 16.3376C10.8556 16.3324 8.24157 16.3013 10.4156 19.3346L9.53046 21.8451L9.25612 20.9962L9.25095 21.0117L8.93519 20.0127L7.25291 14.707C7.25291 14.707 5.10476 16.2185 2.45969 16.8914C0.487534 17.3935 0.394362 19.6711 0.472006 20.7943C0.472006 20.7943 0.585883 22.3213 0.699761 22.9942C0.699761 22.9942 4.5509 25.4944 11.0005 25.4995C17.4501 25.4995 21.3013 22.9942 21.3013 22.9942C21.4152 22.3213 21.529 20.7943 21.529 20.7943C21.6015 19.6711 21.5083 17.3935 19.5362 16.8914Z"
                      fill="#667085"
                    />
                  </svg>
                </div>
                Contractor Users
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ContractorUsers
              individualUsers={contractorUsers}
              setIndividualUsers={setContractorUsers}
              columns={columns}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              showSkeleton={showSkeleton}
              setSearchData={setSearchData}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default Page;
