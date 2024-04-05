"use client";
import React from "react";
import PageTitle from "@/components/PageTitle";
import GetService from "./GetService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetPackages from "./GetPackages";

function Page() {
  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <div className="w-full flex justify-between text-right items-center mb-[10px]">
          <PageTitle title="All Service and Packages" />
          {/* <CreateStor setStores={setStores} /> */}
        </div>
      </div>

      <Tabs defaultValue="GetService" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-full bg-[#0000] gap-[50px]">
          <TabsTrigger
            value="GetService"
            className="my-0 h-[50px] text-base font-medium rounded-[6px] border-[2px] border-[#E7E7E7] "
          >
            Services
          </TabsTrigger>
          <TabsTrigger
            value="GetPackages"
            className="my-0 h-[50px] text-base font-medium border-[2px] border-[#E7E7E7] rounded-[6px] "
          >
            Packages
          </TabsTrigger>
        </TabsList>
        <TabsContent value="GetService">
          <GetService />
        </TabsContent>
        <TabsContent value="GetPackages">
          <GetPackages />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Page;
