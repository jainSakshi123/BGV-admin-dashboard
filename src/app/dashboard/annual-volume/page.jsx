"use client";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import ShowAnnualVolume from "./ShowAnnualVolume";
import ShowBusinessStrength from "./ShowBusinessStrength";
import ShowContractorOrgStrength from "./ShowContractorOrgStrength";
function Page() {
  return (
    <>
      <Accordion
        type="single"
        defaultValue="item-1"
        collapsible
        className="w-full"
      >
        <AccordionItem
          value="item-1"
          className="mb-5 border  rounded-md px-4"
          style={{ boxShadow: "0px 0px 5px #00000024" }}
        >
          <AccordionTrigger className="font-semibold text-[#101828] text-[18px]">
            <div className="flex w-[95%] items-center justify-between">
              Annual Volume
            </div>
          </AccordionTrigger>
          <AccordionContent className="border  rounded-md mb-5">
            <ShowAnnualVolume />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className="mb-5 border  rounded-md px-4"
          style={{ boxShadow: "0px 0px 5px #00000024" }}
        >
          <AccordionTrigger className="font-semibold text-[#101828] text-[18px]">
            Business Org Strength
          </AccordionTrigger>
          <AccordionContent className="border  rounded-md mb-5">
            <ShowBusinessStrength />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-3"
          className="mb-5 border  rounded-md px-4"
          style={{ boxShadow: "0px 0px 5px #00000024" }}
        >
          <AccordionTrigger className="font-semibold text-[#101828] text-[18px]">
            Contractor Org Strength
          </AccordionTrigger>
          <AccordionContent className="border  rounded-md mb-5">
            <ShowContractorOrgStrength />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default Page;
