"use client";
import { useState } from "react";
import { Nav } from "../../components/ui/nav";
import { Home, User, Store } from "lucide-react";
import { useWindowWidth } from "@react-hook/window-size";
import { useRouter } from "next/navigation";
import { mainUrl } from "@/app/Config";
import Cookies from "js-cookie";
import CompanyUserApi from "@/CompanyUserApi";

export default function SideNavbar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }
  const logout = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/companyUser/logout`,
        "POST"
      );
      if (data.status === true) {
        router.push("/admin/sign-in");
      }
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const companyName = Cookies.get("companyName");
  const companyLogo = Cookies.get("companyLogo");
  const baseUrl = `${mainUrl}/uploads/`;
  const filename = companyLogo;
  const imageUrl = baseUrl + filename;
  return (
    <div
      className={`relative   border-r md:px-0 sm:px-0 px-4 pb-10 pt-10 ${
        isCollapsed ? "" : "md:w-[280px]"
      }`}
    >
      <div className="pl-3 pb-6 flex justify-start items-center gap-1 flex-col">
        {/* <Image
          src={imageUrl}
          className="me-3 h-[32px] w-[100px]"
          alt="FlowBite Logo"
          height={32}
          width={30}
        /> */}

        {isCollapsed !== true && !mobileWidth && (
          <span className="self-center text-xl font-semibold sm:text-[20px] whitespace-nowrap dark:text-white ">
            LOGO
          </span>
        )}
      </div>
      {/* {!mobileWidth && (
        <div className="absolute right-[-65px] z-[1] top-[13px]">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-[5px] p-1 w-[45px] h-[45px]"
          >
            <AlignLeft />
          </Button>
        </div>
      )} */}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: Home,
            variant: "custom",
          },
          {
            title: "Service and Packages",
            href: "/dashboard/service-and-packages",
            icon: Store,
            variant: "ghost",
          },
          {
            title: "Manage Users",
            href: "/dashboard/manage-user",
            icon: User,
            variant: "ghost",
          },
          {
            title: "User Information",
            href: "/dashboard/user-information",
            icon: Store,
            variant: "ghost",
          },
          // {
          //   title: "All Company User",
          //   href: "/dashboard/all-company-users",
          //   icon: Building2,
          //   variant: "ghost",
          // },
          // {
          //   title: "User Meetings",
          //   href: "/dashboard/user-meetings",
          //   icon: ClipboardPenLine,
          //   variant: "ghost",
          // },
          // {
          //   title: "User Live Location",
          //   href: "/dashboard/live-location",
          //   icon: MapPinned,
          //   variant: "ghost",
          // },
          // {
          //   title: "User attendance",
          //   href: "/dashboard/attendance",
          //   icon: MapPinned,
          //   variant: "ghost",
          // },
        ]}
      />
    </div>
  );
}
