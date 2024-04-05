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
// import CreateService from "./CreateService";

function ContractorUsers({
  setSearchData,
  showSkeleton,
  totalPages,
  setPage,
  page,
  columns,
  individualUsers,
  setIndividualUsers,
}) {
  const { toast } = useToast();

  const handleDelete = async (serviceID) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/delete-Service/${serviceID}`,
        "DELETE"
      );
      if (data.status === true) {
        toast({
          title: "Success! The Service has been Deleted. ",
          duration: 2000,
        });
        setIndividualUsers((prevStores) =>
          prevStores.filter((store) => store.id !== serviceID)
        );
      }
    } catch (error) {
      console.error("Error deleting Service:", error);
    }
  };

  return (
    <>
      <DataTableDemo
        setSearchData={setSearchData}
        page={page}
        setPage={setPage}
        data={individualUsers}
        setIndividualUsers={setIndividualUsers}
        columns={columns}
        totalPages={totalPages}
        showSkeleton={showSkeleton}
      />
    </>
  );
}

export default ContractorUsers;
