"use client";
import React, { useState, useEffect } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Eye, Trash2, Pencil } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { mainUrl } from "@/app/Config";
import { useRouter } from "next/navigation";
import DataTableDemo from "@/components/DataTableDemo";
import CompanyUserApi from "@/CompanyUserApi";
import CreatePackage from "./CreatePackage";

function GetPackages({}) {
  const router = useRouter();
  const { toast } = useToast();
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [sort, setSort] = useState("");

  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
          >
            Title
          </Button>
        );
      },
      cell: ({ row }) => {
        const title = row?.getValue("title")?.toLowerCase();
        const truncatedtitle =
          title?.length > 20 ? `${title?.slice(0, 20)}...` : title;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="capitalize font-medium text-base text-[#637381]">
                  {truncatedtitle}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="capitalize ">{title}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "pricing",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
          >
            price
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="capitalize font-medium text-base text-[#637381]">
            ${row.getValue("pricing")}/Check
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
              variant="ghost"
              onClick={() =>
                router.push(
                  `/dashboard/service-and-packages/view-all-services/${payment._id}`
                )
              }
              className="h-8 w-8 p-0 rounded-sm hover:border-[#FF8A00] hover:border border  border-[#0000]"
            >
              <Eye className="h-4 w-4 text-[#637381]" />
            </Button>

            <Button
              onClick={() =>
                router.push(
                  `/dashboard/service-and-packages/edit-package/${payment._id}`
                )
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
  const GetUsers = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/get-packages?page=${page}&search=${searchData}&sort=${sort}`,
        "GET"
      );

      if (data.status === true) {
        setShowSkeleton(false);
        setStores(data.packages);
        setTotalPages(data.totalPages);
      } else {
        setShowSkeleton(false);
        console.error("API call was not successful:", data.error);
      }
    } catch (error) {
      setStores([]);
      setShowSkeleton(false);
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const reload = () => {
      if (stores.length + 1) {
        GetUsers();
      }
    };

    reload();

    GetUsers();
  }, [page, stores.length, searchData, sort]);

  const handleDelete = async (serviceID) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/delete-package/${serviceID}`,
        "DELETE"
      );
      if (data.status === true) {
        toast({
          title: "Success! The Service has been Deleted. ",
          duration: 2000,
        });
        GetUsers();
        setStores((prevStores) =>
          prevStores.filter((store) => store.id !== serviceID)
        );
      }
    } catch (error) {
      console.error("Error deleting Service:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <CreatePackage setStores={setStores} data={stores} />
        <DataTableDemo
          // userName={"title"}
          setSearchData={setSearchData}
          page={page}
          setPage={setPage}
          data={stores}
          columns={columns}
          totalPages={totalPages}
          showSkeleton={showSkeleton}
          setSort={setSort}
        />
      </div>
    </>
  );
}

export default GetPackages;
