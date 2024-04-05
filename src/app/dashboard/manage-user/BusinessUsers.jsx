"use client";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { mainUrl } from "@/app/Config";
import { useRouter } from "next/navigation";
import DataTableDemo from "@/components/DataTableDemo";
import CompanyUserApi from "@/CompanyUserApi";

function BusinessUsers({
  setSearchData,
  showSkeleton,
  totalPages,
  setPage,
  page,
  columns,
  individualUsers,
  setIndividualUsers,
}) {
  const router = useRouter();
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

export default BusinessUsers;
