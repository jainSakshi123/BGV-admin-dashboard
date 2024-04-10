"use client";
import React, { useEffect, useState } from "react";
import { mainUrl } from "@/app/Config";
import CompanyUserApi from "@/CompanyUserApi";
import DataTableDemo from "@/components/DataTableDemo";
import { ToastAction } from "@/components/ui/toast";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Pencil } from "lucide-react";
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
import Select from "react-select";
import { useRouter } from "next/navigation";
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
const ViewAllServices = ({ params }) => {
  const router = useRouter();
  const [store, setStore] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [meetingData, setMeetingData] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const { toast } = useToast();
  const handleDelete = async (serviceID) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/delete-service/${params.packageID}/${serviceID}`,
        "DELETE"
      );
      if (data.status === true) {
        fetchData();

        setStore((prevStores) =>
          prevStores.filter((store) => store.id !== serviceID)
        );
        toast({
          title: "Success! The Service has been Deleted. ",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting Service:", error);
    }
  };
  const fetchData = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/get-packages/${params.packageID}?page=${page}&search=${searchData}`,
        "GET"
      );

      if (data.status === true) {
        setShowSkeleton(false);
        setStore(data?.package?.services);
        setTotalPages(data.totalPages);
      } else {
        setShowSkeleton(false);
        console.error("API call was not successful:", data.error);
      }
    } catch (error) {
      setStore([]);
      setShowSkeleton(false);
      console.error("Error fetching data:", error);
    }
  };
  const GetUsers = async () => {
    try {
      const data = await CompanyUserApi(`${mainUrl}/admin/get-services`, "GET");

      if (data.status === true) {
        setServiceData(data.services);
      } else {
        console.error("API call was not successful:", data.error);
      }
    } catch (error) {
      setServiceData([]);

      console.error("Error fetching data:", error);
    }
  };
  const options = serviceData?.map((value) => ({
    serviceId: value._id,
    value: value.serviceName,
    label: value.serviceName,
  }));
  useEffect(() => {
    const reload = () => {
      if (store.length + 1) {
        GetUsers();
      }
    };

    reload();
    GetUsers();
    fetchData();
  }, [page, searchData, params.storeId, store.length]);

  const columns = [
    {
      accessorKey: "serviceName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const serviceName = row.getValue("serviceName")?.toLowerCase();
        const truncatedserviceName =
          serviceName?.length > 20
            ? `${serviceName?.slice(0, 20)}...`
            : serviceName;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="capitalize py-3">{truncatedserviceName}</div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="capitalize ">{serviceName}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("price")}/check</div>;
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
        const payment = row.original;

        return (
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
                  onClick={() => handleDelete(payment.serviceId)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];
  const formik = useFormik({
    initialValues: {
      serviceIds: [],
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          `${mainUrl}/admin/add-services/${params?.packageID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          resetForm();
          setStore((prev) => [...prev, responseData.package.services]);
          GetUsers();

          toast({
            title: "The User has been created. ",
            duration: 2000,
          });
        } else {
          const errorResponse = await response.json();
          toast({
            variant: "destructive",
            title: `${errorResponse.message}`,
            duration: 2000,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } catch (error) {
        alert(error.message);
      }
    },
  });
  return (
    <>
      <div className="relative">
        <form onSubmit={formik.handleSubmit} className="flex justify-end gap-5">
          <Select
            className="my-[10px] md:w-[200px] w-fit"
            closeMenuOnSelect={false}
            options={options}
            isMulti
            onChange={(selectedOptions) => {
              formik.setFieldValue(
                "serviceIds",
                selectedOptions.map((option) => option.serviceId)
              );
            }}
          />{" "}
          <Button
            type="submit"
            className="bg-[#FF8A00] rounded-[5px] text-[#fff]"
          >
            Create Service
          </Button>
        </form>

        <DataTableDemo
          // setSearchData={setSearchData}
          userName={"serviceName"}
          page={page}
          setPage={setPage}
          data={store}
          columns={columns}
          totalPages={totalPages}
          showSkeleton={showSkeleton}
        />
      </div>
    </>
  );
};

export default ViewAllServices;
