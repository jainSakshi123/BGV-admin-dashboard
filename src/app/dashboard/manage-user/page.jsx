"use client";
import React, { useState, useEffect } from "react";
import { mainUrl } from "@/app/Config";
import CreateUser from "./CreateUser";
import CompanyUserApi from "@/CompanyUserApi";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

        return <div className="capitalize py-3">{fullName}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
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
                <div className="">{truncatedemail}</div>
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            contactNo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("contactNo")}</div>;
      },
    },
    {
      accessorKey: "annualVolumeOfChecks",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            annualVolumeOfChecks
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize">
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

      <Tabs defaultValue="IndividualUsers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-[25px] h-full bg-[#0000]">
          <TabsTrigger
            value="IndividualUsers"
            className="my-0 h-[50px] text-base font-medium rounded-[6px] border-[2px] border-[#E7E7E7]"
          >
            Individual Users
          </TabsTrigger>
          <TabsTrigger
            value="BusinessUsers"
            className="my-0 h-[50px] text-base font-medium rounded-[6px] border-[2px] border-[#E7E7E7]"
          >
            Business Users
          </TabsTrigger>
          <TabsTrigger
            value="ContractorUsers"
            className="my-0 h-[50px] text-base font-medium rounded-[6px] border-[2px] border-[#E7E7E7]"
          >
            Contractor Users
          </TabsTrigger>
        </TabsList>
        <TabsContent value="IndividualUsers">
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
        </TabsContent>
        <TabsContent value="BusinessUsers">
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
        </TabsContent>
        <TabsContent value="ContractorUsers">
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
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Page;
