"use client";
import React, { useState, useEffect } from "react";
import { mainUrl } from "@/app/Config";
import CompanyUserApi from "@/CompanyUserApi";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import DataTableDemo from "@/components/DataTableDemo";
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
import { Trash2, Pencil } from "lucide-react";
import CreateUser from "./CreateUser";
function ContractorUsers({ setContractorUsers, contractorUsers }) {
  const { toast } = useToast();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [sort, setSort] = useState("");

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
          >
            email
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
          >
            contactNo
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
          >
            annualVolumeOfChecks
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
    {
      id: "action",
      enableHiding: false,
      header: () => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
          >
            Actions
          </Button>
        );
      },
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex justify-start items-center gap-1">
            <Button
              onClick={() =>
                router.push(`/dashboard/manage-user/edit-user/${payment._id}`)
              }
              variant="ghost"
              className="h-8 w-8 p-0 rounded-sm hover:border-[#FF8A00] hover:border border  border-[#0000]"
            >
              <Pencil className="h-4 w-4 text-[#637381]" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger className="relative hover:border-[#FF8A00] border border-[#0000] hover:border custom-hover  w-fit cursor-pointer my-0 flex  select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Trash2 className="h-4 w-4 text-[#637381]" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to proceed with deleting this Service?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Deleting this Service will remove the data permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-[#fff] rounded-[5px] text-[#FF8A00] border-[2px] border-[#FF8A00] my-0"
                    onClick={() => handleDelete(payment._id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
  const GetCompanyUsers = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/get-users?page=${page}&search=${searchData}&sort=${sort}`,
        "GET"
      );
      if (data.status === true) {
        setContractorUsers(data.allUsers.contractorUsers.results);
        setShowSkeleton(false);
        setTotalPages(data.allUsers.contractorUsers.totalPages);
      }
    } catch (error) {
      setusers([]);
      setShowSkeleton(false);
      console.error("Error fetching data:", error);
    }
  };
  const handleDelete = async (userId) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/delete-user/${userId}`,
        "DELETE"
      );
      if (data.status === true) {
        GetCompanyUsers();
        toast({
          title: "Success! The Service has been Deleted. ",
          duration: 2000,
        });

        setBusinessUsers((prevData) =>
          prevData.filter((data) => data.id !== userId)
        );
      }
    } catch (error) {
      console.error("Error deleting Service:", error);
    }
  };
  useEffect(() => {
    const reload = () => {
      if (contractorUsers.length + 1) {
        GetCompanyUsers();
      }
    };

    reload();

    GetCompanyUsers();
  }, [page, contractorUsers.length, searchData, sort]);
  return (
    <>
      <DataTableDemo
        setSortData={setSort}
        setSearchData={setSearchData}
        page={page}
        setPage={setPage}
        data={contractorUsers}
        setIndividualUsers={setContractorUsers}
        columns={columns}
        totalPages={totalPages}
        showSkeleton={showSkeleton}
      />
    </>
  );
}

export default ContractorUsers;
