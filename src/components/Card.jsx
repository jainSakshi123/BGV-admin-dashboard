/** @format */

import React from "react";
import { cn } from "@/lib/utils";

export default function Card(props) {
  return (
    <CardContent className="">
      <section className="flex justify-between gap-2 py-3 px-5">
        <div className="h-[60px] w-[60px] rounded-full  flex justify-center items-center  bg-[#5b93ff36]  border border-[#5b93ff36]">
          <props.icon className="h-[24px] w-[24px] text-[#5B93FF]" />
        </div>
        <div>
          <p className="text-[18px] font-bold ">{props.label}</p>
          <p className="text-sm font-normal text-[#030229]">{props.amount}</p>
        </div>
      </section>
    </CardContent>
  );
}

export function CardContent(props) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col justify-between gap-3 rounded-[8px] border py-4 px-5  shadow bg-[#fff] ",
        props.className
      )}
    />
  );
}
