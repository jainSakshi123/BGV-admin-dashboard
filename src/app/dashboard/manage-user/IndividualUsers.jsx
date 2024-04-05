"use client";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { mainUrl } from "@/app/Config";
import { useRouter } from "next/navigation";
import DataTableDemo from "@/components/DataTableDemo";
import CompanyUserApi from "@/CompanyUserApi";
import CreateUser from "./CreateUser";

function IndividualUsers({
  setSearchData,
  showSkeleton,
  totalPages,
  setPage,
  page,
  columns,
  individualUsers,
  setIndividualUsers,
}) {
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

export default IndividualUsers;
