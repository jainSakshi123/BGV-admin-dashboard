import { CircleUserRound } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function SalesCard(props) {
  return (
    <div className="  flex flex-nowrap justify-between gap-3 ">
      <section className="flex justify-between gap-3 ">
        <div className=" h-12 w-12 rounded-full bg-gray-100 p-1 text-center align-middle">
          <CircleUserRound className="mt-2 mx-2" />
        </div>
        <div className="text-sm">
          <p><Link href={props.CustomLink}>{props.userName}</Link></p>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400">
            {props.userEmail}
          </div>
        </div>
      </section>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm font-normal text-ellipsis whitespace-nowrap overflow-hidden sm:w-[160px] w-[120px]">
              {props.storeName}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-normal">{props.storeName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
