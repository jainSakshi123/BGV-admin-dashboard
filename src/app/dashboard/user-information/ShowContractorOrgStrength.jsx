"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Trash2, Pencil } from "lucide-react";
import { mainUrl } from "@/app/Config";
import { useRouter } from "next/navigation";
import CompanyUserApi from "@/CompanyUserApi";

import { Skeleton } from "@/components/ui/skeleton";
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
import "react-time-picker-input/dist/components/TimeInput.css";
import AddVolume from "./AddVolume";
import EditDrpdown from "./EditDropdown";

function ShowContractorOrgStrength() {
  const { toast } = useToast();
  const customArray = new Array(10).fill(null);
  const [contractorOrg, setContractorOrg] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchData, setSearchData] = useState("");
  const GetUsers = async () => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/con-org-strength-list`,
        "GET"
      );

      if (data.status === true) {
        setShowSkeleton(false);
        setContractorOrg(data.contractorOrgStrength);
        setTotalPages(data.totalPages);
      } else {
        setShowSkeleton(false);
        console.error("API call was not successful:", data.error);
      }
    } catch (error) {
      setContractorOrg([]);
      setShowSkeleton(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const reload = () => {
      if (contractorOrg.length + 1) {
        GetUsers();
      }
    };

    reload();
    GetUsers();
  }, [page, searchData, contractorOrg.length]);

  const handleDelete = async (contractorOrgId, option) => {
    try {
      const data = await CompanyUserApi(
        `${mainUrl}/admin/delete-con-org-strength/${contractorOrgId}/options/${option}`,
        "DELETE"
      );

      if (data.status === true) {
        GetUsers();
        toast({
          title: "Success! The data has been Deleted. ",
          duration: 2000,
        });

        // Ensure annualVolume is an array before filtering
        if (Array.isArray(contractorOrg)) {
          setContractorOrg((prevcontractorOrg) =>
            prevcontractorOrg.filter((volume) => volume._id !== contractorOrgId)
          );
        } else {
          console.error("contractorOrg is not an array:", contractorOrg);
        }
      }
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  return (
    <>
      <div className="px-8 text-end">
        <AddVolume
          setAnnualVolume={setContractorOrg}
          postData={`${mainUrl}/admin/add-con-org-strength`}
        />
      </div>
      {showSkeleton ? (
        customArray.map((value, index) => (
          <div
            key={`custom-skeleton-${index}`}
            className="flex items-center space-x-4 py-[12px] px-2 border-b border-b-[#e5e5e5]"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4" style={{ width: "95%" }} />
            </div>
          </div>
        ))
      ) : contractorOrg?.options?.length > 0 ? (
        contractorOrg?.options?.map((option, index) => (
          <div
            key={index}
            className={`px-8 ${
              index !== contractorOrg.options?.length - 1 && "border-b"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#667085] font-normal py-5">
                {option}
              </p>
              <div className="flex justify-between items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger className="h-8 w-8 p-0 rounded-sm hover:border-[#FF8A00] hover:border border  border-[#0000] custom-hover flex justify-center items-center">
                    <Trash2 className="h-4 w-4 text-[#637381]" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to proceed with deleting this
                        Service?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Deleting this Service will remove the data permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-[#fff] rounded-[5px] text-[#FF8A00] border-[2px] border-[#FF8A00] my-0">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-[#FF8A00] rounded-[5px] text-[#fff] border-[2px] border-[#FF8A00] my-0"
                        onClick={() => handleDelete(contractorOrg._id, option)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <EditDrpdown
                  apiURL={`admin/edit-con-org-strength`}
                  params={contractorOrg._id}
                  option={option}
                  setContractorOrg={setContractorOrg}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-[300px]">
          <svg
            width="102"
            height="109"
            viewBox="0 0 102 109"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="51" cy="53.5" rx="51" ry="10.5" fill="#F5F5F5" />
            <path
              d="M16 21L32.0737 2.38573C32.8335 1.50581 33.9386 1 35.1011 1H67.4519C68.5955 1 69.6844 1.48951 70.4436 2.34487L87 21"
              stroke="#E2E2E2"
              strokeWidth="1.5"
            />
            <path
              d="M88.25 24V52C88.25 53.7949 86.7949 55.25 85 55.25H18C16.2051 55.25 14.75 53.7949 14.75 52V24C14.75 22.2051 16.2051 20.75 18 20.75H32.5C34.2949 20.75 35.75 22.2051 35.75 24V26C35.75 28.6234 37.8766 30.75 40.5 30.75H63C65.6234 30.75 67.75 28.6234 67.75 26V24C67.75 22.2051 69.2051 20.75 71 20.75H85C86.7949 20.75 88.25 22.2051 88.25 24Z"
              fill="#FAFAFA"
              stroke="#E2E2E2"
              strokeWidth="1.5"
            />
            <path
              d="M23.176 86.4503V103H20.881L12.4687 90.8625H12.3152V103H9.81821V86.4503H12.1293L20.5497 98.604H20.7032V86.4503H23.176ZM31.8528 103.251C30.6892 103.251 29.6737 102.984 28.8063 102.45C27.939 101.917 27.2656 101.171 26.7861 100.212C26.3066 99.2531 26.0669 98.1326 26.0669 96.8504C26.0669 95.5629 26.3066 94.4369 26.7861 93.4726C27.2656 92.5083 27.939 91.7594 28.8063 91.2261C29.6737 90.6928 30.6892 90.4261 31.8528 90.4261C33.0165 90.4261 34.032 90.6928 34.8993 91.2261C35.7667 91.7594 36.4401 92.5083 36.9196 93.4726C37.399 94.4369 37.6388 95.5629 37.6388 96.8504C37.6388 98.1326 37.399 99.2531 36.9196 100.212C36.4401 101.171 35.7667 101.917 34.8993 102.45C34.032 102.984 33.0165 103.251 31.8528 103.251ZM31.8609 101.222C32.6151 101.222 33.2401 101.023 33.7357 100.624C34.2313 100.226 34.5977 99.6949 34.8347 99.0323C35.0771 98.3696 35.1983 97.6397 35.1983 96.8423C35.1983 96.0504 35.0771 95.3231 34.8347 94.6605C34.5977 93.9925 34.2313 93.4564 33.7357 93.0524C33.2401 92.6483 32.6151 92.4463 31.8609 92.4463C31.1013 92.4463 30.471 92.6483 29.97 93.0524C29.4744 93.4564 29.1053 93.9925 28.8629 94.6605C28.6259 95.3231 28.5073 96.0504 28.5073 96.8423C28.5073 97.6397 28.6259 98.3696 28.8629 99.0323C29.1053 99.6949 29.4744 100.226 29.97 100.624C30.471 101.023 31.1013 101.222 31.8609 101.222ZM51.0046 103.242C50.0026 103.242 49.1083 102.987 48.3217 102.475C47.5406 101.958 46.9264 101.222 46.4793 100.269C46.0375 99.3097 45.8167 98.1595 45.8167 96.8181C45.8167 95.4767 46.0402 94.3292 46.4874 93.3756C46.9399 92.4221 47.5594 91.6921 48.346 91.1857C49.1325 90.6793 50.0241 90.4261 51.0208 90.4261C51.7911 90.4261 52.4107 90.5554 52.8794 90.814C53.3535 91.0672 53.7198 91.3635 53.9784 91.7029C54.2424 92.0423 54.4471 92.3413 54.5925 92.5999H54.738V86.4503H57.1542V103H54.7946V101.069H54.5925C54.4471 101.333 54.237 101.634 53.9622 101.974C53.6929 102.313 53.3211 102.609 52.8471 102.863C52.373 103.116 51.7588 103.242 51.0046 103.242ZM51.5379 101.182C52.2329 101.182 52.8201 100.999 53.2996 100.632C53.7844 100.261 54.1508 99.7461 54.3986 99.0888C54.6518 98.4316 54.7784 97.6666 54.7784 96.7939C54.7784 95.9319 54.6545 95.1777 54.4067 94.5312C54.1589 93.8847 53.7952 93.381 53.3157 93.0201C52.8363 92.6591 52.2437 92.4786 51.5379 92.4786C50.8107 92.4786 50.2046 92.6672 49.7197 93.0443C49.2349 93.4214 48.8685 93.9359 48.6207 94.5878C48.3783 95.2396 48.2571 95.975 48.2571 96.7939C48.2571 97.6235 48.381 98.3696 48.6288 99.0323C48.8766 99.6949 49.243 100.22 49.7278 100.608C50.2181 100.991 50.8214 101.182 51.5379 101.182ZM64.2149 103.275C63.4283 103.275 62.7172 103.129 62.0815 102.838C61.4458 102.542 60.9421 102.114 60.5704 101.554C60.2041 100.993 60.0209 100.306 60.0209 99.4929C60.0209 98.7925 60.1556 98.2161 60.4249 97.7636C60.6943 97.311 61.0579 96.9528 61.5159 96.6888C61.9738 96.4248 62.4856 96.2255 63.0512 96.0908C63.6169 95.9561 64.1933 95.8538 64.7805 95.7837C65.524 95.6975 66.1274 95.6275 66.5907 95.5736C67.054 95.5144 67.3907 95.4201 67.6008 95.2908C67.8109 95.1615 67.9159 94.9514 67.9159 94.6605V94.6039C67.9159 93.8982 67.7166 93.3514 67.318 92.9635C66.9247 92.5756 66.3375 92.3817 65.5563 92.3817C64.7428 92.3817 64.1017 92.5622 63.6331 92.9231C63.1697 93.2787 62.8492 93.6746 62.6714 94.111L60.4007 93.5938C60.6701 92.8396 61.0633 92.2308 61.5805 91.7675C62.1031 91.2988 62.7037 90.9594 63.3825 90.7493C64.0613 90.5338 64.7752 90.4261 65.524 90.4261C66.0196 90.4261 66.5449 90.4854 67.0998 90.6039C67.66 90.717 68.1826 90.9271 68.6675 91.2342C69.1577 91.5413 69.5591 91.9803 69.8715 92.5514C70.184 93.117 70.3402 93.8524 70.3402 94.7575V103H67.9806V101.303H67.8836C67.7274 101.615 67.493 101.923 67.1806 102.224C66.8681 102.526 66.4668 102.776 65.9765 102.976C65.4863 103.175 64.8991 103.275 64.2149 103.275ZM64.7401 101.335C65.4082 101.335 65.9792 101.203 66.4533 100.939C66.9328 100.675 67.2964 100.331 67.5442 99.905C67.7974 99.474 67.924 99.0134 67.924 98.5232V96.9232C67.8378 97.0093 67.6708 97.0902 67.423 97.1656C67.1806 97.2356 66.9031 97.2976 66.5907 97.3514C66.2782 97.3999 65.9738 97.4457 65.6775 97.4888C65.3812 97.5265 65.1334 97.5589 64.9341 97.5858C64.4654 97.645 64.0371 97.7447 63.6492 97.8848C63.2667 98.0249 62.9596 98.2269 62.728 98.4908C62.5017 98.7494 62.3886 99.0942 62.3886 99.5252C62.3886 100.123 62.6095 100.576 63.0512 100.883C63.493 101.184 64.056 101.335 64.7401 101.335ZM79.3524 90.5877V92.5271H72.5726V90.5877H79.3524ZM74.3908 87.6139H76.807V99.3555C76.807 99.8242 76.877 100.177 77.0171 100.414C77.1571 100.646 77.3376 100.805 77.5585 100.891C77.7848 100.972 78.0299 101.012 78.2938 101.012C78.4878 101.012 78.6575 100.999 78.8029 100.972C78.9484 100.945 79.0615 100.923 79.1423 100.907L79.5787 102.903C79.4386 102.957 79.2393 103.011 78.9807 103.065C78.7221 103.124 78.3989 103.156 78.011 103.162C77.3753 103.172 76.7827 103.059 76.2332 102.822C75.6837 102.585 75.2393 102.219 74.8999 101.723C74.5605 101.228 74.3908 100.605 74.3908 99.8565V87.6139ZM85.6374 103.275C84.8508 103.275 84.1397 103.129 83.504 102.838C82.8683 102.542 82.3646 102.114 81.9929 101.554C81.6266 100.993 81.4434 100.306 81.4434 99.4929C81.4434 98.7925 81.5781 98.2161 81.8474 97.7636C82.1168 97.311 82.4804 96.9528 82.9384 96.6888C83.3963 96.4248 83.9081 96.2255 84.4737 96.0908C85.0394 95.9561 85.6158 95.8538 86.203 95.7837C86.9465 95.6975 87.5499 95.6275 88.0132 95.5736C88.4765 95.5144 88.8132 95.4201 89.0233 95.2908C89.2334 95.1615 89.3384 94.9514 89.3384 94.6605V94.6039C89.3384 93.8982 89.1391 93.3514 88.7405 92.9635C88.3472 92.5756 87.76 92.3817 86.9788 92.3817C86.1653 92.3817 85.5242 92.5622 85.0556 92.9231C84.5922 93.2787 84.2717 93.6746 84.0939 94.111L81.8232 93.5938C82.0926 92.8396 82.4858 92.2308 83.003 91.7675C83.5256 91.2988 84.1262 90.9594 84.805 90.7493C85.4838 90.5338 86.1977 90.4261 86.9465 90.4261C87.4421 90.4261 87.9674 90.4854 88.5223 90.6039C89.0825 90.717 89.6051 90.9271 90.09 91.2342C90.5802 91.5413 90.9816 91.9803 91.294 92.5514C91.6065 93.117 91.7627 93.8524 91.7627 94.7575V103H89.4031V101.303H89.3061C89.1499 101.615 88.9155 101.923 88.6031 102.224C88.2906 102.526 87.8893 102.776 87.399 102.976C86.9088 103.175 86.3216 103.275 85.6374 103.275ZM86.1626 101.335C86.8307 101.335 87.4017 101.203 87.8758 100.939C88.3553 100.675 88.7189 100.331 88.9667 99.905C89.2199 99.474 89.3465 99.0134 89.3465 98.5232V96.9232C89.2603 97.0093 89.0933 97.0902 88.8455 97.1656C88.6031 97.2356 88.3256 97.2976 88.0132 97.3514C87.7007 97.3999 87.3963 97.4457 87.1 97.4888C86.8037 97.5265 86.5559 97.5589 86.3566 97.5858C85.8879 97.645 85.4596 97.7447 85.0717 97.8848C84.6892 98.0249 84.3821 98.2269 84.1505 98.4908C83.9242 98.7494 83.8111 99.0942 83.8111 99.5252C83.8111 100.123 84.032 100.576 84.4737 100.883C84.9155 101.184 85.4785 101.335 86.1626 101.335Z"
              fill="#C4C4C4"
            />
          </svg>
        </div>
      )}
    </>
  );
}

export default ShowContractorOrgStrength;
