"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Trash2, Pencil } from "lucide-react";
import { mainUrl } from "@/app/Config";
import { useRouter } from "next/navigation";
import CompanyUserApi from "@/CompanyUserApi";

import { Skeleton } from "@/components/ui/skeleton";
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
import "react-time-picker-input/dist/components/TimeInput.css";
import AddVolume from "./AddVolume";
import EditDrpdown from "./EditDropdown";
import DataTableDemo from "@/components/DataTableDemo";

function BusinessIndustry() {
  const { toast } = useToast();
  const customArray = new Array(10).fill(null);
  const [BusinessIndustry, setBusinessIndustry] = useState([]);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [id, setId] = useState("");
  const columns = [
    {
      accessorKey: "BusinessIndustry",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-[#2B4447] font-semibold text-base"
          >
            options
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.original}</div>;
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
        return (
          <div className="flex justify-start items-center gap-1">
            <EditDrpdown
              apiURL={`admin/edit-business-industry`}
              params={id}
              option={row.original}
              setContractorOrg={setBusinessIndustry}
              variant="ghost"
              className="h-8 w-8 p-0 rounded-sm hover:border-[#FF8A00] hover:border border  border-[#0000]"
            />

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
                    onClick={() => handleDelete(id, row.original)}
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
        `${mainUrl}/admin/bus-industry-list?page=${page}&sort=${sort}&search=${searchData}`,
        "GET"
      );

      if (data.status === true) {
        setShowSkeleton(false);
        setId(data.businessIndustry._id);

        setBusinessIndustry(data.businessIndustry.options);
        setTotalPages(data.totalPages);
      } else {
        setShowSkeleton(false);
        console.error("API call was not successful:", data.error);
      }
    } catch (error) {
      setBusinessIndustry([]);
      setShowSkeleton(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const reload = () => {
      if (BusinessIndustry.length + 1) {
        GetUsers();
      }
    };

    reload();
    GetUsers();
  }, [page, searchData, BusinessIndustry.length, sort]);

  const handleDelete = async (BusinessIndustryId, option) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/delete-business-industry/${BusinessIndustryId}/options/${option}`,
        "DELETE"
      );

      if (data.status === true) {
        GetUsers();
        toast({
          title: "Success! The data has been Deleted. ",
          duration: 2000,
        });

        // Ensure annualVolume is an array before filtering
        if (Array.isArray(BusinessIndustry)) {
          setBusinessIndustry((prevBusinessIndustry) =>
            prevBusinessIndustry.filter(
              (volume) => volume._id !== BusinessIndustryId
            )
          );
        } else {
          console.error("BusinessIndustry is not an array:", BusinessIndustry);
        }
      }
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  return (
    <>
      <div className="px-8 text-end">
        <AddVolume
          setAnnualVolume={setBusinessIndustry}
          postData={`${mainUrl}/admin/add-business-industry`}
        />
      </div>
      <div className="px-4">
        <DataTableDemo
          setSortData={setSort}
          setSearchData={setSearchData}
          page={page}
          setPage={setPage}
          data={BusinessIndustry}
          columns={columns}
          totalPages={totalPages}
          showSkeleton={showSkeleton}
        />
      </div>
    </>
  );
}

export default BusinessIndustry;
