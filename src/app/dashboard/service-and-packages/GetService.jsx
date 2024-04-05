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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { mainUrl } from "@/app/Config";
import { useRouter } from "next/navigation";
import DataTableDemo from "@/components/DataTableDemo";
import CompanyUserApi from "@/CompanyUserApi";
import CreateService from "./CreateService";

function GetService({}) {
  const router = useRouter();
  const { toast } = useToast();
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchData, setSearchData] = useState("");

  const columns = [
    {
      accessorKey: "serviceName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const serviceName = row.getValue("serviceName")?.toLowerCase();
        const truncatedserviceName =
          serviceName?.length > 20
            ? `${serviceName?.slice(0, 20)}...`
            : serviceName;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="capitalize">{truncatedserviceName}</div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="capitalize">{serviceName}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = row.getValue("price");
        const truncatedprice =
          price.length > 20 ? `${price.slice(0, 20)}...` : price;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="capitalize">{truncatedprice}</div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="capitalize">{price}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const description = row.getValue("description");
        const truncateddescription =
          description?.length > 20
            ? `${description.slice(0, 20)}...`
            : description;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="capitalize">{truncateddescription}</div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="capitalize">{description}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },

    {
      id: "action",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer custom-hover"
                onClick={() =>
                  router.push(
                    `/dashboard/service-and-packages/edit-service/${payment._id}`
                  )
                }
              >
                Edit user
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger className="relative custom-hover  w-full cursor-pointer my-0 flex  select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  Delete Service
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to proceed with deleting this
                      Service?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Deleting this Service will remove the data permanently.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#fff] rounded-[5px] text-[#FF8A00] border-[2px] border-[#FF8A00] my-0">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0"
                      onClick={() => handleDelete(payment._id)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const GetUsers = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/get-services?page=${page}&search=${searchData}`,
        "GET"
      );

      if (data.status === true) {
        setShowSkeleton(false);
        setStores(data.services);
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
  }, [page, stores.length, searchData]);

  const handleDelete = async (serviceID) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/delete-services/${serviceID}`,
        "DELETE"
      );
      if (data.status === true) {
        toast({
          title: "Success! The Service has been Deleted. ",
          duration: 2000,
        });
        setStores((prevStores) =>
          prevStores.filter((store) => store.id !== serviceID)
        );
        GetUsers();
      }
    } catch (error) {
      console.error("Error deleting Service:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <CreateService setStores={setStores} />
        <DataTableDemo
          setSearchData={setSearchData}
          page={page}
          setPage={setPage}
          data={stores}
          columns={columns}
          totalPages={totalPages}
          showSkeleton={showSkeleton}
        />
      </div>
    </>
  );
}

export default GetService;
