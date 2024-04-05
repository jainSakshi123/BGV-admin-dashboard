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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { mainUrl } from "@/app/Config";
// import CreateStor from "./CreateStor";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/PageTitle";
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

  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
                <div className="capitalize">{truncatedtitle}</div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="capitalize">{title}</div>
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("pricing")}</div>;
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
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/dashboard/service-and-packages/view-all-services/${payment._id}`
                  )
                }
              >
                View Services
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/dashboard/service-and-packages/edit-package/${payment._id}`
                  )
                }
              >
                Edit user
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger className="relative custom-hover  w-full cursor-pointer my-0 flex  select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  Delete Package
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="my-0"
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
        `${mainUrl}/admin/get-packages?page=${page}&search=${searchData}`,
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
  }, [page, stores.length, searchData]);

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
          userName={"title"}
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

export default GetPackages;
