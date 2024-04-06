"use client";
import React, { useEffect, useState } from "react";
import { mainUrl } from "@/app/Config";
import CompanyUserApi from "@/CompanyUserApi";
import DataTableDemo from "@/components/DataTableDemo";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import ViewOutcome from "@/app/kitchen/meeting-report/ViewOutcome";
import { Image } from "lucide-react";
const ViewStore = ({ params }) => {
  const [store, setStore] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [meetingData, setMeetingData] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchData, setSearchData] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CompanyUserApi(
          `${mainUrl}/companyUser/get-store/${params.storeId}`,
          "GET"
        );
        if (!data || !data.status) {
          throw new Error("Failed to fetch store details");
        }
        const baseUrl = `${mainUrl}/uploads/`;
        const filename = data.store.photo;

        let imageUrl;
        if (filename) {
          if (filename.startsWith("https://")) {
            imageUrl = filename;
          } else {
            imageUrl = `${baseUrl}${filename}`;
          }
        } else {
          imageUrl = null;
        }

        if (Array.isArray(data.store)) {
          const storesWithPhotoUrl = data.store.map((store) => ({
            ...store,
            photo: store.photo
              ? store.photo.startsWith("https://")
                ? store.photo
                : `${baseUrl}${store.photo}`
              : null,
          }));
          setStore(storesWithPhotoUrl);
        } else {
          setStore({
            ...data.store,
            photo: imageUrl,
          });
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };
    const viewStoreData = async () => {
      try {
        const data = await CompanyUserApi(
          `${mainUrl}/companyUser/meeting-report/${params.storeId}?page=${page}&search=${searchData}`,
          "GET"
        );
        if (data.status === true) {
          setShowSkeleton(false);
          setMeetingData(data.meetings);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        setShowSkeleton(false);
        console.error("Error fetching store details:", error);
        setShowSkeleton(false);
      }
    };
    viewStoreData();
    fetchData();
  }, [page, searchData, params.storeId]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US")
    );
  }
  const columns = [
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("userName")}</div>
      ),
    },

    {
      accessorKey: "checkInTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Check In Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDate(row.getValue("checkInTime"))}
        </div>
      ),
    },

    {
      accessorKey: "checkOutTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Check Out Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDate(row.getValue("checkOutTime"))}
        </div>
      ),
    },
    {
      accessorKey: "meetingOutcome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Meeting Outcome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const meetingOutcome = row.getValue("meetingOutcome");
        const truncatedmeetingOutcome =
          meetingOutcome?.length > 20
            ? `${meetingOutcome.slice(0, 20)}...`
            : meetingOutcome;

        return <div className="capitalize">{truncatedmeetingOutcome}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return <ViewOutcome CompanyName={payment.meetingOutcome} />;
      },
    },
  ];

  return (
    <>
      {store ? (
        <>
          <div className=" rounded-[5px]">
            <h4 className="text-[28px] text-left font-bold py-3 text-[#f59e59] ">
              Store Details
            </h4>
          </div>
          <div className=" gap-5  w-full">
            <div className="grid  grid-cols-12 gap-4 py-5 ">
              <div className=" col-span-4">
                <h1 className=" font-bold">Store Name</h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <h2>
                    {store.storeName
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </h2>
                </div>
              </div>

              <div className=" col-span-4">
                <h1 className=" font-bold">Location</h1>

                {store.geoLocation && (
                  <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                    <p>Latitude {store.geoLocation.coordinates[1]}</p>
                  </div>
                )}
              </div>
              <div className=" col-span-4">
                <h1 className=" font-bold">Location</h1>

                {store.geoLocation && (
                  <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                    <p>Longitude {store.geoLocation.coordinates[0]}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid  grid-cols-12 gap-4 py-5 ">
              <div className=" col-span-4">
                <h1 className=" font-bold">City</h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p> {store.city}</p>
                </div>
              </div>
              <div className=" col-span-4">
                <h1 className=" font-bold">State</h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p> {store.state}</p>
                </div>
              </div>
              <div className=" col-span-4">
                <h1 className=" font-bold">Zip Code</h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p> {store.zipCode}</p>
                </div>
              </div>
            </div>

            <div className="grid  grid-cols-12 gap-4 py-5">
              <div className=" col-span-4">
                <h1 className=" font-bold">Contact Email</h1>
                <div className="lowercase flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p> {store.contactPersonEmail}</p>
                </div>
              </div>
              <div className=" col-span-4">
                <h1 className=" font-bold">Contact Number </h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p>{store.phoneNumber}</p>
                </div>
              </div>

              <div className=" col-span-4">
                <h1 className=" font-bold">Opening Time</h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p>{store.openingTime}</p>
                </div>
              </div>
            </div>

            <div className="grid  grid-cols-12 gap-4 py-5">
              <div className=" col-span-4">
                <h1 className=" font-bold">Closing Time </h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p> {store.closingTime}</p>
                </div>
              </div>
              <div className=" col-span-4">
                <h1 className=" font-bold">Address</h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p> {store.address}</p>
                </div>
              </div>
              <div className=" col-span-4">
                <h1 className=" font-bold">Days of Operation </h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  {store.daysOfOperation &&
                    store.daysOfOperation.length > 0 && (
                      <p>{store.daysOfOperation.join(", ")}</p>
                    )}
                </div>
              </div>
            </div>
            <div className="grid  grid-cols-12 gap-4 py-5">
              <div className=" col-span-4">
                <h1 className=" font-bold">Description </h1>
                <div className="flex items-center min-h-9 max-h-[100%] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 col-span-3 mt-3">
                  <p>{store.description}</p>
                </div>
              </div>

              <div className=" col-span-4">
                <h1 className=" font-bold">Image</h1>
                <div className="border border-[#cac8c8] rounded-md w-[110px] h-[110px] flex justify-center items-center mt-3">
                  {store?.photo ? (
                    <img
                      src={store?.photo}
                      alt="Store Photo"
                      className="max-h-50  object-contain h-[100px] w-[100px]"
                    />
                  ) : (
                    <Image
                      className="h-[75px] w-[75px]"
                      style={{ stroke: "rgb(203 203 203)" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="border w-full border-[#e7e7e7] flex justify-center items-center h-[300px] rounded-[6px]">
          <h2 className="text-[#c4c4c4] text-[26px] font-medium">
            Store has been deleted
          </h2>
        </div>
      )}
      <div className=" rounded-[5px]">
        <h4 className="text-[28px] text-left font-bold py-3 text-[#f59e59] ">
          Employee Store Visit Summary
        </h4>
      </div>
      <DataTableDemo
        page={page}
        setPage={setPage}
        data={meetingData}
        columns={columns}
        setSearchData={setSearchData}
        // userName={"userName"}
        showSkeleton={showSkeleton}
        totalPages={totalPages}
      />
    </>
  );
};

export default ViewStore;
