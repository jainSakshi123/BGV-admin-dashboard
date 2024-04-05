"use client";
import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NextBreadcrumb = ({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks,
}) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <div>
      <ul className={containerClasses}>
        <li className={listClasses}>
          <Link href={"/dashboard/dashboard"}>{homeElement}</Link>
        </li>
        {/* {pathNames.length > 0 && separator} */}
        {pathNames.map((link, index) => {
          if (
            index === pathNames.length - 1 &&
            /^[0-9a-fA-F]{24}$/.test(link)
          ) {
            // Skip rendering if it's an id (assuming it's a MongoDB ObjectId)
            return null;
          }

          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          let itemClasses =
            paths === href ? `${listClasses} ${activeClasses}` : listClasses;

          let itemLink = link
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link href={href}>{itemLink}</Link>
              </li>
              {pathNames.length !== index + 1 &&
                !/^[0-9a-fA-F]{24}$/.test(pathNames[index + 1]) &&
                separator}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default NextBreadcrumb;
